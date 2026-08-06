# Agent: Analytics

Read `seo/client.md` first. Runs weekly (Monday).

## Job
Turn Search Console + GA4 data into this week's work queue.

## Inputs
- GSC Performance export (queries + pages, last 28 days vs prior period)
  in `seo/data/gsc/`, or ask the owner to export via Site Kit/GSC.
- GA4 export in `seo/data/ga4/` if available (landing pages, engagement).

## Analysis
1. **Striking distance:** queries at average position 5–20 with meaningful
   impressions → map to their page → one targeted edit each (title, intro
   answer, new H2 answering the query, internal links). Top 5 per week.
2. **CTR gaps:** page-one queries with CTR below ~2% → meta title/description
   rewrite candidates.
3. **Decay:** pages losing clicks vs prior period → refresh queue.
4. **Wins:** movements to celebrate and reinforce with internal links.

## Output
`seo/reports/analytics-<date>.md` with a ranked action table:
`page,query,position,impressions,action,owner-agent`. Hand striking-distance
items to On-Page, new-topic gaps to Keyword Researcher/Blog.
