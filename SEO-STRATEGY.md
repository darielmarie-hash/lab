# Cashé's Hair Emporium — SEO Automation Strategy (Zero New Software)

A strategic plan for automating SEO on **casheshair.com** using only tools you
already have: Claude (this subscription), your WordPress/WooCommerce site, and
free Google services. No Ahrefs, Semrush, Surfer, Jasper, or agency retainers.

The approach follows the "specialist SEO team built with Claude Code" method
(per the reference videos, e.g. *"I Built An Entire Specialist SEO Team With
Claude Code In 14 Minutes"*): instead of paying for SEO SaaS, you define a set
of specialist AI agents — researcher, strategist, writer, optimizer, auditor —
that run inside Claude Code against free data sources (Google Search Console,
your own site's REST API) and publish directly to WordPress.

---

## 1. What the live audit found (Aug 2026)

Stack detected on casheshair.com:

| Component | Status | Why it matters |
|---|---|---|
| WordPress 7.0.2 + WooCommerce 11 | ✅ current | REST API available for automated publishing |
| Yoast SEO (free) | ✅ installed | Sitemaps, titles/metas — no paid SEO plugin needed |
| Site Kit by Google | ✅ installed | Search Console + GA4 are already connected — your free rank/traffic data source |
| Elementor | ✅ | Page building; watch page-speed weight |
| Jetpack (free tier) | ✅ | MCP write access is gated behind Jetpack AI/Complete (paid) — **skip it**; the free path is WordPress Application Passwords + REST API |

Content inventory:

- **41 blog posts.** Three strong, specific 2026 posts (sew-in tangling,
  scalp care under wigs/extensions, coily texture-match guide) and ~26 generic
  2024 posts (e.g. "Latest Trends in Healthier Hair Care") that read like
  commodity content — thin, unfocused, and a **large content gap from Nov 2024
  to Jun 2026**.
- **34 products**: 5 signature bundle lines (Capri Silk, Belize Cascade, Bali
  Breeze, Persia Whirl, Fiji Coil), pro install methods (I-Tip, K-Tip, Tape-In,
  Hybrid Weft), Bee Girl line, growth/edge products.
- **Product page metas are already good** (e.g. Capri Silk's title/meta are
  well-written) — recent optimization is visible. The blog is the weak layer.
- **Attribute sitemaps are exposed** (`pa_color`, `pa_length`, `pa_size`,
  `pa_texture`, `pa_weight`) — these generate thin, near-duplicate archive
  pages that dilute crawl budget and should be noindexed.
- Distinct audiences: **retail buyers** (women, largely textured/coily hair)
  and **Salon Pros** (B2B stylists, 10% bulk program) — two keyword universes.

## 2. The strategy in one paragraph

Win with **money pages + striking-distance refreshes first**, then build
**hub-and-spoke content** around the questions your buyers actually search
("tape-in vs i-tip", "how to keep a sew-in from tangling", "best shampoo for
wigs and extensions"), each hub linking down to your product pages. Power it
with a weekly automated loop: Claude pulls Search Console data, finds queries
where you rank 5–20 (page one is one edit away), rewrites those pages, and
publishes drafts via the WordPress REST API for your one-click approval. That
loop — not any single article — is where the compounding impact is.

## 3. Ranked priorities (maximum impact first)

1. **Fix index bloat (1 hour, one-time).** In Yoast → Search Appearance,
   set product attribute archives (color/length/size/texture/weight) and tag
   archives to `noindex`. Removes dozens of thin pages competing with your
   real category pages.
2. **Striking-distance sprint (week 1–2).** Pull GSC queries at positions
   5–20 with impressions. Each is a page-one candidate with a single targeted
   edit (title, intro, one new section answering the query, internal links).
   This is the fastest measurable traffic gain available.
3. **Category/collection pages as landing pages.** Ensure there are indexable
   category pages for each texture (straight, body wave, loose wave, deep
   wave, curly) and each method (tape-in, i-tip, k-tip, weft) with 200–400
   words of real buying guidance + FAQ schema. These target the highest-value
   commercial keywords ("raw virgin body wave bundles", "tape-in extensions
   for black hair").
4. **Refresh, don't just add.** The ~26 generic 2024 posts either get rewritten
   to the standard of your 2026 posts (specific, persona-targeted, linking to
   products) or get merged/redirected into stronger pieces. Google rewards the
   refresh date + quality jump; stale thin posts drag the whole domain.
5. **Hub-and-spoke new content (2 posts/week, automated drafting).**
   - *Install & maintenance hub*: sew-in care, tape-in aftercare, i-tip vs
     k-tip vs tape-in comparison, how long each method lasts, removal guides.
   - *Texture hub*: matching bundles to 3c/4a/4b/4c hair, blending guides per
     signature line (the coily-girl texture-match post is the template — it's
     your best post).
   - *Care-product hub*: wig/extension shampoo guides, edge care, growth oil
     science — each linking to the relevant Bee Girl / Edge Entity product.
   - *Salon Pro hub (B2B)*: wholesale buying guides, "what to stock in your
     salon", client-retention content → feeds the Salon Pro program.
6. **Local + brand layer.** A Chicago-focused page (LocalBusiness schema,
   Google Business Profile — free) captures "hair extensions Chicago" and
   builds the E-E-A-T story: founded 2018, real owner, real store.
7. **Schema upgrades.** WooCommerce emits Product schema already; add
   FAQPage schema on category pages and Article + author schema on posts
   (Yoast free handles most of this once authors have real bios).

## 4. The specialist agent team (built in this repo, run in Claude Code)

Create these as skills/prompt files under `.claude/` — each is a role you
invoke, exactly as in the videos, except pointed at your real data:

| Agent | Job | Data in | Output |
|---|---|---|---|
| **Keyword Researcher** | Mine GSC queries, autocomplete, "People Also Ask"; cluster by intent and audience (retail vs Salon Pro) | GSC API export, competitor SERPs | Keyword map CSV committed to repo |
| **Content Strategist** | Maintain the hub-and-spoke map; pick the next 2 topics weekly; assign target keyword + internal links | Keyword map, sitemap inventory | Content briefs |
| **Writer** | Draft posts in the voice of your 2026 posts (specific, texture-aware, product-linked); never publishes directly | Brief + 2–3 existing posts as style reference | Draft via WP REST API (`status: draft`) |
| **On-Page Optimizer** | Striking-distance refreshes: retitle, restructure, add FAQ, internal links | GSC positions 5–20 | Edit drafts for approval |
| **Technical Auditor** | Monthly crawl: broken links, orphan pages, missing metas, slow pages, index bloat | Site crawl via curl/sitemap | Issue list with fixes |
| **Performance Tracker** | Weekly report: clicks/impressions/position deltas per page; flags wins and decays | GSC API | `reports/seo-week-N.md` |

Human in the loop: **everything publishes as a WordPress draft**; you approve
in wp-admin. That keeps quality control while automating 90% of the labor.

## 5. Free-tool wiring (the "no new software" part)

- **Publishing:** WordPress **Application Passwords** (built into core, free).
  Create one at Users → Profile → Application Passwords, then Claude posts via
  `POST /wp-json/wp/v2/posts` with basic auth. No Jetpack upgrade, no Zapier.
- **Rank & traffic data:** **Google Search Console API** (free). Site Kit means
  GSC is already verified; add a Google Cloud service account (free tier) or
  export CSVs manually each week and drop them in this repo for the agents.
- **Scheduling:** GitHub Actions cron in this repo (free) or Claude Code
  Routines — e.g. Monday 8am: run Tracker + Optimizer; Wednesday: Writer
  drafts 2 posts from the strategist's queue.
- **Keyword discovery beyond GSC:** Google autocomplete + People Also Ask
  (scraped politely by the researcher agent), plus Google Trends — all free.
- **This repo** is the system of record: keyword maps, briefs, reports, and
  the agent prompt files live here, versioned.

## 6. Operating cadence

**Weekly (≈1 hr of your time, rest automated):**
- Mon — Tracker report + striking-distance list generated.
- Tue — Optimizer submits 3–5 refresh drafts → you approve.
- Wed — Writer submits 2 new-post drafts → you approve.
- Fri — 15-min review: what moved, what's next.

**Monthly:** Technical audit; refresh 4–6 of the old 2024 posts; review hub
coverage vs the keyword map.

**30 / 60 / 90 outcomes to expect:**
- 30 days: index bloat fixed, 12–15 striking-distance refreshes live, first
  measurable position improvements on refreshed pages.
- 60 days: category pages rebuilt as landing pages, 8+ new hub posts,
  refreshed posts reaching page one for their target queries.
- 90 days: full hub coverage for one hub (install & maintenance), old-post
  refresh complete, compounding organic clicks visible in the weekly report —
  the loop now runs itself with your approvals.

## 7. What NOT to spend on

- Rank trackers (GSC position data is free and first-party).
- AI writing SaaS (Claude is the writer, with your product truth as context).
- Paid SEO plugins (Yoast free + manual schema covers this site's needs).
- Backlink marketplaces (risk > reward; earn links via the Salon Pro network,
  local Chicago press, and supplier/brand pages instead).
