# Agent: Keyword Researcher

Read `seo/client.md` and `SEO-STRATEGY.md` first.

## Job
Build and maintain the keyword map for casheshair.com, split by audience
(retail vs Salon Pro) and intent (informational → blog, commercial →
category/product pages).

## Data sources (in priority order)
1. **Google Search Console** — first-party queries. Use the exports in
   `seo/data/gsc/` if present, or ask the owner for a fresh Performance
   export (last 3 months, queries + pages).
2. **Google autocomplete + People Also Ask** — expand each root keyword
   ("bundles for 4c hair", "tape-in vs i-tip", "sew-in tangling", "wig
   shampoo", "edge growth oil", "raw virgin hair Chicago", wholesale terms).
3. Optional: DataForSEO MCP if connected (pay-as-you-go) for volume/difficulty.

## Filters (from the masterclass)
- Prefer difficulty ≤30 (when data available), volume ≥100, correct intent.
- Exclude competitor brand names and other businesses' names.
- Bottom-of-funnel first: specific texture/method/concern phrasing.

## Output
Write `seo/data/keywords.csv` with columns:
`keyword,cluster_root,intent,audience,priority,target_page,status`
plus a short `seo/reports/keyword-map-<date>.md` summary: top 10 priorities,
striking-distance overlaps flagged for the On-Page agent, and question
keywords flagged for the Blog agent. Never reuse a keyword already
`status=published` in the CSV.
