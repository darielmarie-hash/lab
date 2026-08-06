# Analytics — casheshair.com — 2026-08-06

## Status: blocked on data (action needed)
The striking-distance sprint — the single fastest-impact tactic — needs
**Google Search Console query data**, which isn't in the repo yet and can't
be pulled from this session (GSC API needs the OAuth/service-account path,
and this session's network is restricted).

### What to export (free, ~3 min)
1. Search Console → casheshair.com property → **Performance → Search results**.
2. Date: **Last 3 months**. Add the **Query** and **Page** dimensions.
3. **Export → CSV** (or Google Sheets), and drop the file(s) in
   `seo/data/gsc/`.
4. Re-run `/seo-team analytics` (or `weekly`).

Site Kit is already installed, so the data exists — it just needs exporting
(or, later, a service-account key to automate it).

### What I'll produce once the export lands
- **Striking-distance list:** queries at avg position 5–20 with impressions
  → mapped to their page → one targeted edit each (top 5/week to On-Page).
- **CTR gaps:** page-one queries with low CTR → meta rewrites.
- **Decay:** pages losing clicks vs prior period → refresh queue.
- **Wins:** pages moving up → reinforce with internal links.

## What we can act on now without GSC
From the technical + keyword passes, these are high-confidence wins that
don't require query data:
1. Un-thin the empty method category pages (tape-in/i-tip/k-tip) — they
   rank for nothing today, so any real content is upside.
2. Add meta descriptions to the category pages missing them.
3. Fix the sew-in post's missing meta description + duplicate H1 (your
   best post, currently under-optimized).
4. Noindex the 42 attribute/tag archives.

These are queued for the weekly cycle regardless of GSC.
