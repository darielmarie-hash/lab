# SEO Engine Decision Brief — Yoast Premium vs ThinkRank — 2026-08-06

## The urgent finding (fix regardless of choice)
**Both Yoast SEO Premium and ThinkRank are actively emitting head tags on
every page**, producing duplicates site-wide:

| Tag | Homepage | Posts |
|---|---|---|
| meta description | 2 | 2 |
| canonical | 2 | 2 |
| og:title | 2 | 2 |
| twitter:card | 2 | 2 |
| JSON-LD blocks | 6 | 4 |

Duplicate **canonical** tags are the most harmful (conflicting "official URL"
signals to Google). This is live now and should be resolved this week by
making ONE plugin the SEO output engine and turning the other's output off
(or deactivating it).

## Current wiring
- **Yoast SEO Premium** — active, mature, paid. Emitting the classic Yoast
  head block + schema. Fields are NOT REST-writable without a shim (an
  inactive "Claude Yoast SEO Controller" plugin exists for this).
- **ThinkRank v1.26.0** — active, free tier (Pro off). Emitting its own head
  block + storing per-post meta (`_thinkrank_*`). NOT connected to anything:
  AI provider unconfigured, GSC/GA unconfigured, llms.txt 404. REST + MCP
  native; AI provider list includes Claude.

## Head-to-head for THIS site + the automation/GEO strategy

### Yoast SEO Premium — keep as source of truth
**Pros:** battle-tested and stable; already paid for; trusted schema output;
internal-linking suggestions, redirect manager, cornerstone content, orphaned-
content workout; Semrush/Wincher integrations; the team already knows it.
**Cons:** not natively Claude/REST-writable (needs the shim to automate field
writes); no native "GSC opportunities" automation; no instant indexing; no
llms.txt/GEO tooling; the automated + GEO parts of the plan stay more manual.

### ThinkRank — make it the SEO/GEO engine
**Pros:** purpose-built for exactly this plan — GSC-connected **SEO
opportunities** (automates the striking-distance sprint), **instant indexing**
(automates "request indexing"), **llms.txt** generation (GEO), **schema
generate/deploy** incl. LocalBusiness, **AI metadata/alt-text**; REST + its
own MCP server, so a Claude session can drive it directly; free tier is
generous; supports a Claude API key.
**Cons:** much newer and less proven (v1.26, small vendor) — betting your
core SEO foundation on it is a real risk; AI features need an API key (usage
cost); some features gated behind Pro; GSC + AI still need a one-time setup
(Google OAuth + key); long-term support/maturity unknown.

## Three viable configurations
1. **Yoast-only (lowest risk).** Deactivate ThinkRank. Yoast owns titles/
   meta/schema/sitemaps. Automate field writes via the Claude-Yoast shim.
   Add GEO/indexing gaps by other means (manual llms.txt, GSC export, IndexNow
   plugin). Safe, proven; less automation.
2. **ThinkRank-only (most aligned, higher risk).** Wind Yoast down. ThinkRank
   owns everything and is Claude/MCP-drivable; connect Claude key + GSC to
   unlock opportunities, indexing, llms.txt, schema. Best fit for the vision;
   newer plugin risk.
3. **Split (both strengths, most fragile).** Yoast = source of truth for
   meta/schema/sitemaps (all ThinkRank output for those turned OFF to stop
   duplication); ThinkRank runs ONLY the gaps Yoast lacks — llms.txt, GSC
   opportunities, instant indexing. Powerful but requires careful, ongoing
   config discipline to avoid re-duplicating tags.

## Recommendation
- **This week:** kill the duplicate-tag conflict — pick one output engine.
- **Lower-risk pick:** Config 1 (Yoast-only), because your SEO foundation
  shouldn't ride on a brand-new plugin, and Yoast Premium is already paid.
- **If the automation/GEO payoff is the priority** and you're comfortable on
  a newer tool: Config 2 (ThinkRank-only) is the most strategy-aligned and
  the most Claude-drivable — its GSC-opportunities feature alone replaces the
  manual export I've been asking for.
- **Config 3** only if you want both and will keep its settings disciplined.

## Ways to de-risk before committing (I can do these read-only/dry-run)
- Pull what ThinkRank's SEO analysis + schema output *would* be for a page and
  compare quality to Yoast's, so you judge on real output.
- Prepare the exact click-path to eliminate the duplicate tags for whichever
  engine you keep.
- Note: connecting ThinkRank to Google (OAuth) and adding an AI key are
  owner-only steps; everything after that I can drive via its REST/MCP.

## Other stack redundancies (housekeeping, separate from the above)
- **Two active image optimizers:** EWWW + "Image Optimization" (+ ThinkRank
  image-SEO). Keep one.
- **Two caching layers:** WP Rocket + SiteGround Speed Optimizer both active —
  coordinate or pick one to avoid cache conflicts.
- Several inactive-but-installed plugins (extra payment gateways, social
  feeds, 3 admin-search tools, "Seona" another SEO tool) — deleting unused
  ones reduces security surface.
