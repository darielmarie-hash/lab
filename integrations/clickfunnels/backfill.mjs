#!/usr/bin/env node
// One-off backfill: tag every past quiz respondent from historical form submissions.
//
//   CF_API_TOKEN=... CF_WORKSPACE_HOST=darieltaylorsteamwo4484a.myclickfunnels.com \
//   CF_WORKSPACE_ID=432626 node backfill.mjs            # dry run (prints the plan)
//   ... DRY_RUN=0 node backfill.mjs                     # actually apply
//
// Rules match the live worker: preview/partial/test submissions are ignored, and
// when a contact has several completed submissions the newest one wins.

import { cfClient, tagContactForSubmission } from './cf-api.js';
import * as rules from './quiz-tags.js';

const { CF_API_TOKEN, CF_WORKSPACE_HOST, CF_WORKSPACE_ID } = process.env;
if (!CF_API_TOKEN || !CF_WORKSPACE_HOST || !CF_WORKSPACE_ID) {
  console.error('Set CF_API_TOKEN, CF_WORKSPACE_HOST, CF_WORKSPACE_ID');
  process.exit(1);
}
const dryRun = process.env.DRY_RUN !== '0';

const api = cfClient({ host: CF_WORKSPACE_HOST, token: CF_API_TOKEN });

const submissions = await api.listFormSubmissions(CF_WORKSPACE_ID);
console.log(`fetched ${submissions.length} form submissions`);

const latestByContact = new Map();
let skippedIncomplete = 0;
let skippedTest = 0;
for (const sub of submissions) {
  if (!sub.contact_id || !rules.isCompleteSubmission(sub.data)) { skippedIncomplete++; continue; }
  if (rules.isTestEmail(sub.data.contact?.email)) { skippedTest++; continue; }
  const prev = latestByContact.get(sub.contact_id);
  if (!prev || new Date(sub.created_at) > new Date(prev.created_at)) {
    latestByContact.set(sub.contact_id, sub);
  }
}
console.log(
  `${latestByContact.size} contacts to tag ` +
  `(skipped ${skippedIncomplete} incomplete/preview/partial, ${skippedTest} test submissions)`,
);
if (dryRun) console.log('DRY RUN — nothing will be written; set DRY_RUN=0 to apply\n');

for (const [contactId, sub] of latestByContact) {
  const email = sub.data.contact?.email ?? '(no email)';
  console.log(`contact ${contactId} <${email}> — submission ${sub.id} @ ${sub.created_at}`);
  const { added, removed } = await tagContactForSubmission(
    api,
    { workspaceId: CF_WORKSPACE_ID, contactId, data: sub.data },
    rules,
    { dryRun, log: (m) => console.log(`  ${m}`) },
  );
  if (added.length === 0 && removed.length === 0) console.log('  already up to date');
}
console.log('done');
