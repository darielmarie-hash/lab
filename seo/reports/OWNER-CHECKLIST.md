# Owner Checklist — casheshair.com (from first-run + weekly, 2026-08-06)

Things only you can do (wp-admin access / Google account). Everything else
was drafted for you — see "Drafts waiting for approval" at the bottom.

## A. Approve the drafts (5 min) — wp-admin → Posts / Pages → Drafts
- [ ] Blog: **Tape-In vs I-Tip vs K-Tip Extensions** (ID 9603) — review, add a
      real story where the comment marks it, Publish.
- [ ] Blog: **The Best Bundles for 4C Hair** (ID 9604) — review, add a
      texture-match story, Publish.
- [ ] Page: **Hair Extensions in Chicago** (ID 9605) — add your real
      address/phone/hours where marked, Publish.
- [ ] Trash the earlier **Connection Test** draft (ID 9602).

## B. Two structural fixes that unlock ranking (15 min)
- [ ] **Assign products to the empty method categories.** Products → each
      tape-in / i-tip / k-tip / hybrid-weft product → set its Category. Right
      now these category pages have 0 products and rank for nothing.
- [ ] **Noindex the 42 thin archive pages.** Yoast → Search Appearance →
      Taxonomies: set product attribute archives (color/length/size/texture/
      weight) + Tags to **noindex**. Removes crawl-budget drain.

## C. Paste-in content (10 min) — from seo/reports/pending-drafts/
- [ ] Category copy + meta + FAQ: **tape-in**, **i-tip**, **raw bundles**
      (`category-*.md`). Do this *after* B (assigning products).
- [ ] **LocalBusiness schema** with your real NAP (`localbusiness-schema.md`)
      — biggest lever for "hair extensions Chicago" + AI visibility.
- [ ] **Sew-in post meta description** + fix its duplicate H1 (same file).
- [ ] Fix **homepage double-H1** in Elementor (same file).

## D. Data + accounts (owner-only)
- [ ] **Export Search Console data** → drop CSV in `seo/data/gsc/`
      (Performance → last 3 months → Query + Page → Export). Unlocks the
      striking-distance sprint next cycle.
- [ ] **Run the GEO test panel once** (see geo report) — ask ChatGPT/Claude/
      Perplexity the 6 buyer questions, note if Cashé's is cited. Baseline.
- [ ] **Confirm Google Business Profile** is claimed and active for Chicago.

## E. Make the content unmistakably yours (ongoing, high impact)
- [ ] Fill the TODOs in `seo/voice/stories.md`, `stats.md`, `opinions.md`.
      The blog drafts have `<!-- OWNER: add a story -->` markers — your real
      anecdotes are the one thing competitors and AI can't copy.

---
### Drafts waiting for approval (created this session, nothing live)
| Type | Title | ID | Edit |
|---|---|---|---|
| Post | Tape-In vs I-Tip vs K-Tip Extensions | 9603 | /wp-admin/post.php?post=9603&action=edit |
| Post | The Best Bundles for 4C Hair | 9604 | /wp-admin/post.php?post=9604&action=edit |
| Page | Hair Extensions in Chicago | 9605 | /wp-admin/post.php?post=9605&action=edit |

### Ready-to-paste files (in seo/reports/pending-drafts/)
- category-tape-in.md · category-i-tip.md · category-raw-bundles.md
- localbusiness-schema.md (schema + sew-in/homepage H1 + meta fixes)
