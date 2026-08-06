# Technical Audit — casheshair.com — 2026-08-06

Live crawl via the REST API + rendered-page fetches (SiteGround anti-bot
solved automatically). Ranked by impact.

## P1 — Index bloat: 42 thin archive pages are indexable
Confirmed indexable (no `noindex`, self-canonical), e.g. `/color/1/`,
`/color/10-60/`, `/color/10a/`:

| Sitemap | Pages |
|---|---|
| pa_color | 13 |
| pa_length | 11 |
| pa_size | 10 |
| pa_texture | 6 |
| pa_weight | 1 |
| product_tag | 1 |
| **Total** | **42** |

These are near-empty attribute archives competing with real category pages
and wasting crawl budget. **Fix:** Yoast → Search Appearance → Taxonomies /
Media → set product attribute archives + tags to `noindex`. One-time,
~15 min, owner action in wp-admin.

## P1 — Salon-method category pages are empty
`/product-category/salon-products/i-tip/`, `/tape-in/`, `/k-tip/`,
`/hybrid-weft/` return **0 products** (product_cat count = 0), yet the
products exist at `/product/i-tip/`, `/product/k-tip/`, etc. The products
aren't assigned to their categories, so these commercial-intent category
pages are thin (445 words, template only) and rank for nothing.
**Fix:** in wp-admin → Products, assign each method product to its matching
category; then the On-Page agent adds buying-guide copy + FAQ. High
commercial value ("tape-in extensions", "i-tip extensions").

## P2 — Category pages missing meta descriptions
`/product-category/virgin-hair-bundles/` (Raw Hair Extensions), `/i-tip/`,
`/tape-in/` all have **no meta description** and default "X Archives |
Cashé's" titles. **Fix (On-Page agent):** write keyword-led titles + meta
descriptions and 200–400 words of buying guidance. These are your top
commercial landing pages.

## P2 — Heading structure issues
- **Homepage: 2 H1s** ("Luxury hair, without the markup." + "Luxury hair.
  No passport required."). Should be exactly one.
- **Blog index: 0 H1s** — no primary heading at all.
- **Sew-in post: duplicate H1** (same title rendered twice) + **missing
  meta description** (the site's best post, under-optimized).
Fix via Elementor template / Yoast fields; On-Page agent drafts the meta.

## P3 — Schema gaps (feeds the GEO pass)
- Product pages are strong: Capri Silk has Product + **FAQPage** schema;
  Edge Entity has Product + AggregateRating (**no FAQ**).
- Category pages: CollectionPage only — **no FAQPage**. Add Q&A blocks.
- Homepage: Organization + WebSite, but **no LocalBusiness** (no address/
  phone in schema) — see GEO report.

## Healthy (no action)
- Sitemaps present and correct; robots.txt sane; HTTPS/canonical clean;
  product metas recently optimized; About page exists at `/about/`.
- Page speed: not measured this run — needs a Lighthouse export in
  `seo/data/lighthouse/` for the DevTools→paste→optimize loop.

## Handoffs
- **Owner (wp-admin):** noindex archives (P1); assign method products to
  categories (P1); fix homepage double-H1 (P2).
- **On-Page agent:** category titles/metas/copy + FAQ (P2), sew-in post meta
  + de-dupe H1 (P2), category FAQPage schema (P3).
- **Owner:** run Lighthouse on home + a product page, save report to
  `seo/data/lighthouse/`.
