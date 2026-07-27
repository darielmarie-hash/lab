// Minimal ClickFunnels 2.0 API client. Works in both Cloudflare Workers and Node 18+.
// Docs: https://developers.myclickfunnels.com — note the API requires a User-Agent
// header in addition to the Bearer token, and paginates with ?after=<last id> at 20/page.

export function cfClient({ host, token, userAgent = 'cashes-quiz-tagger/1.0' }) {
  const base = `https://${host}/api/v2`;

  async function req(method, path, body) {
    const res = await fetch(`${base}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': userAgent,
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 429) {
      const wait = Number(res.headers.get('Retry-After') || 5);
      await new Promise((r) => setTimeout(r, wait * 1000));
      return req(method, path, body);
    }
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`ClickFunnels API ${method} ${path} → ${res.status}: ${text.slice(0, 300)}`);
    }
    if (res.status === 204) return null;
    return res.json();
  }

  async function getAll(path) {
    const sep = path.includes('?') ? '&' : '?';
    const items = [];
    let after = null;
    for (;;) {
      const page = await req('GET', after ? `${path}${sep}after=${after}` : path);
      if (!Array.isArray(page) || page.length === 0) break;
      items.push(...page);
      if (page.length < 20) break;
      after = page[page.length - 1].id;
    }
    return items;
  }

  return {
    req,
    getAll,
    listContactTags: (workspaceId) => getAll(`/workspaces/${workspaceId}/contacts/tags`),
    createContactTag: (workspaceId, name, color) =>
      req('POST', `/workspaces/${workspaceId}/contacts/tags`, { contacts_tag: { name, color } }),
    listAppliedTags: (contactId) => getAll(`/contacts/${contactId}/applied_tags`),
    applyTag: (contactId, tagId) =>
      req('POST', `/contacts/${contactId}/applied_tags`, { contacts_applied_tag: { tag_id: tagId } }),
    removeAppliedTag: (appliedTagId) => req('DELETE', `/contacts/applied_tags/${appliedTagId}`),
    listFormSubmissions: (workspaceId) => getAll(`/workspaces/${workspaceId}/form_submissions`),
  };
}

// Core tagging routine shared by the worker and the backfill:
// ensure every needed tag exists, then reconcile the contact's applied quiz tags
// to exactly match the submission (stale same-category tags are removed so
// retakes stay accurate; non-quiz tags are never touched).
export async function tagContactForSubmission(api, { workspaceId, contactId, data }, helpers, { dryRun = false, log = () => {} } = {}) {
  const { tagNamesFor, categoryOfTag, TAG_COLOR } = helpers;
  const wanted = tagNamesFor(data);

  const allTags = await api.listContactTags(workspaceId);
  const byName = new Map(allTags.map((t) => [t.name, t]));
  for (const name of wanted) {
    if (!byName.has(name)) {
      log(`create tag ${name}`);
      if (!dryRun) byName.set(name, await api.createContactTag(workspaceId, name, TAG_COLOR));
    }
  }

  const applied = await api.listAppliedTags(contactId);
  const appliedByName = new Map(applied.map((a) => [a.tag?.name ?? a.tag_name, a]));
  const wantedCategories = new Set(wanted.map(categoryOfTag).filter(Boolean));

  const added = [];
  const removed = [];
  for (const [name, appliedTag] of appliedByName) {
    const cat = categoryOfTag(name);
    if (cat && wantedCategories.has(cat) && !wanted.includes(name)) {
      log(`remove stale ${name} from contact ${contactId}`);
      if (!dryRun) await api.removeAppliedTag(appliedTag.id);
      removed.push(name);
    }
  }
  for (const name of wanted) {
    if (!appliedByName.has(name)) {
      log(`apply ${name} to contact ${contactId}`);
      if (!dryRun) await api.applyTag(contactId, byName.get(name).id);
      added.push(name);
    }
  }
  return { added, removed };
}
