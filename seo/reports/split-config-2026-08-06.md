# SEO Split Config — Yoast (source of truth) + ThinkRank (gaps) — 2026-08-06

**Decision:** Run split for 90 days, then reevaluate a full switch to
ThinkRank. **Yoast SEO Premium owns all on-page output** (titles, meta
descriptions, canonicals, Open Graph/Twitter, schema, sitemap, robots).
**ThinkRank runs ONLY the gaps Yoast lacks:** llms.txt (GEO), Search-Console
"SEO opportunities," and instant indexing. ThinkRank must emit **no**
front-end head tags, so it never duplicates Yoast.

## Done already (via ThinkRank REST API, this session)
- ✅ Open Graph output — **disabled**
- ✅ Twitter cards output — **disabled**
- ✅ ThinkRank sitemap — **disabled** (Yoast's `/sitemap_index.xml` stays)
- ✅ Reverted a site-identity test change (no unverified change left behind)

## Owner to finish in the ThinkRank admin UI (API-locked or cache-bound)
ThinkRank → its settings screens. Turn **OFF** every front-end output module
so only the backend features remain:

1. **Schema / Structured Data → disable.** (API returned 403; UI only.)
   Yoast emits Organization/Product/Article/FAQ schema.
2. **Titles & Meta / Site Identity → disable ThinkRank's title + meta
   description + canonical output.** This is the remaining duplicate source
   (meta description ×2, canonical ×2, and title ×3 were all seen live).
   Yoast owns these.
3. **Social / Open Graph → confirm OFF** (already set via API; verify the UI
   reflects it).
4. **Sitemap → confirm OFF** (already set via API).
5. **robots.txt management → disable** (Yoast owns robots.txt).

**Then purge caches** (WP Rocket → "Clear cache" + SiteGround → Purge SG
Cache) — changes won't show until you do.

**Verify (2 min):** open the homepage, View Source, Ctrl-F each of:
`canonical`, `name="description"`, `og:title`, `<title` — each should appear
**once**. If any still shows twice, that ThinkRank module is still on.

> Why the UI and not automated: these are the deindex-adjacent tags
> (canonical/robots), ThinkRank's schema endpoint is API-locked, and the
> page cache prevented reliable verification from the automation side. The
> UI gives you a toggle + cache purge + visual confirmation in one place.

## Owner: turn ON ThinkRank's kept features (the reason we're keeping it)
Google is **already OAuth-connected** in ThinkRank (`google_account_connected:
true`) — nice, half the setup is done. To activate the gap features:

1. **SEO Analytics (GSC opportunities)** — enable it and select the
   casheshair.com property. This surfaces striking-distance queries
   automatically (replaces the manual CSV export). Endpoint proof:
   `/thinkrank/v1/seo-analytics/opportunities`.
2. **Instant Indexing** — enable and connect (Google Indexing/IndexNow key)
   so new/updated URLs get submitted automatically.
3. **llms.txt** — generate it (currently 404). This is the GEO/AI file.
4. **AI provider (optional but needed for AI features)** — add an API key.
   ThinkRank supports Claude directly (`claude_api_key`); model list includes
   claude-opus-4-8 / sonnet-5 / haiku-4.5. Only needed for AI metadata/alt
   generation — not required for analytics/indexing/llms.txt.

## Separately: stack consolidation (not part of the SEO engines)
- **Two image optimizers active:** EWWW + "Image Optimization". Keep one,
  deactivate the other (double-processing risk).
- **Two caching layers active:** WP Rocket + SiteGround Speed Optimizer.
  Standard clean setup: let WP Rocket handle page/file cache and turn OFF
  SiteGround's dynamic cache (keep SG's server-level/Memcached), or vice
  versa — but don't run both page caches hot.

## 90-day reevaluation checklist (set a reminder ~Nov 4, 2026)
Switch fully to ThinkRank only if all of these hold:
- [ ] No duplicate tags reappeared under the split (stayed clean).
- [ ] ThinkRank's GSC opportunities proved accurate/useful vs. raw GSC.
- [ ] Instant indexing measurably sped up new-page indexing.
- [ ] llms.txt live and AI citations trending up (GEO test panel).
- [ ] ThinkRank stayed stable through its updates (no output regressions).
- [ ] Support/maturity felt trustworthy enough for the core layer.
If any fail → stay on Yoast for the core; keep ThinkRank for gaps only.
