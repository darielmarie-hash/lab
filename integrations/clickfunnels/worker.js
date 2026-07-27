// Cloudflare Worker: live tag-on-answer layer for the Find Your Match quiz.
//
// ClickFunnels sends form.submission.created webhooks here; the worker filters out
// preview/partial/test submissions, then reconciles the contact's quiz_* tags to
// match their answers (see cf-api.js for the reconcile rules).
//
// Required secrets/vars (wrangler secret put / wrangler.toml):
//   CF_API_TOKEN       — ClickFunnels API token (Team Settings → Developer Portal)
//   CF_WORKSPACE_HOST  — e.g. darieltaylorsteamwo4484a.myclickfunnels.com
//   CF_WORKSPACE_ID    — e.g. 432626
//   WEBHOOK_TOKEN      — any long random string; must match ?token= in the webhook URL

import { cfClient, tagContactForSubmission } from './cf-api.js';
import * as rules from './quiz-tags.js';

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('POST only', { status: 405 });

    const url = new URL(request.url);
    if (!env.WEBHOOK_TOKEN || url.searchParams.get('token') !== env.WEBHOOK_TOKEN) {
      return new Response('unauthorized', { status: 401 });
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return new Response('invalid JSON', { status: 400 });
    }

    // Webhook envelope is { event_type_id, data: <FormSubmission> }; tolerate a bare
    // submission object too so the endpoint is easy to test with curl.
    const submission = payload?.data && typeof payload.data === 'object' ? payload.data : payload;
    const answers = submission?.data;
    const contactId = submission?.contact_id;

    const skip = (reason) =>
      Response.json({ status: 'skipped', reason, submission_id: submission?.id ?? null });

    if (!contactId || !answers) return skip('not a form submission event');
    if (!rules.isCompleteSubmission(answers)) return skip('incomplete, preview, or partial submission');
    if (rules.isTestEmail(answers.contact?.email)) return skip('test email');

    const api = cfClient({ host: env.CF_WORKSPACE_HOST, token: env.CF_API_TOKEN });
    try {
      const result = await tagContactForSubmission(
        api,
        { workspaceId: env.CF_WORKSPACE_ID, contactId, data: answers },
        rules,
      );
      return Response.json({ status: 'tagged', contact_id: contactId, ...result });
    } catch (err) {
      // 500 makes ClickFunnels retry the delivery rather than drop it.
      return Response.json({ status: 'error', message: String(err) }, { status: 500 });
    }
  },
};
