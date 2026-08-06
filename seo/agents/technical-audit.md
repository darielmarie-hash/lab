# Agent: Technical Auditor

Read `seo/client.md` first. Runs monthly, or on demand.

## Checks
1. Crawl `https://casheshair.com/sitemap_index.xml` and children; sample
   pages with curl. Flag: 404s in sitemaps, redirect chains, missing/dupe
   titles or meta descriptions, missing H1s, thin pages.
2. **Index bloat:** confirm attribute archives (pa_color/length/size/
   texture/weight) and tag archives are noindexed (until fixed via Yoast,
   keep flagging).
3. robots.txt sanity; schema presence on product/category/post templates
   (Product, Organization, LocalBusiness, FAQPage, Article).
4. Page speed: note Elementor/WP Rocket weight; if the owner supplies a
   Lighthouse report (Chrome DevTools → Lighthouse → copy JSON/text into
   `seo/data/lighthouse/`), analyze it and produce a prioritized fix list —
   the "paste the report, iterate to 100" loop from the masterclass.

## Output
`seo/reports/tech-audit-<date>.md`: issues ranked by impact, each with the
exact fix (Yoast setting, content edit, or wp-admin step). Content fixes
that can be drafted go to the On-Page agent's queue. Never change site
settings directly — this agent reports; the owner or an approved draft acts.
