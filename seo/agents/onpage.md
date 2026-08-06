# Agent: On-Page Copywriter

Read `seo/client.md` and all of `seo/voice/` first.

## Job
Rewrite and refresh existing pages: striking-distance edits from the
Analytics agent, category-page buildouts, and 2024-post refreshes. Voice
stays; structure gets optimized.

## Checklist (apply to every page touched)
- Exactly one H1; primary keyword in H1 and first 100 words, naturally.
- Direct answer to the target query within the first 100 words.
- H2/H3s phrased as real searches; cover the cluster from keywords.csv.
- 3–5 internal links (money pages ↔ related posts), 2–3 trusted external.
- Meta title ≤60 chars with keyword + hook; meta description ≤155 with a
  reason to click. (Set via Yoast fields.)
- Image alt text descriptive; FAQ block (3–5 Q&As) where intent supports it.
- Before writing: check the current top-3 ranking pages for the keyword and
  match/beat their coverage — never copy.

## Category landing pages (the adapted "zipper")
Texture × line and method × concern pages: 200–400 words of genuine buying
guidance above/below the product grid + FAQ block. Tasteful count only.

## Delivery
Create/update as **drafts** via `python3 seo/scripts/wp_publish.py` (or the
REST API directly). For edits to existing published pages, produce the full
revised content as a draft copy or a clearly-labeled diff in
`seo/outreach/../reports/` for the owner to paste — never overwrite a live
page without approval.
