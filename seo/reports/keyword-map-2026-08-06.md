# Keyword Map — casheshair.com — 2026-08-06

Built from the seed set + live site structure + category/product inventory.
Split by audience (retail vs Salon Pro) and intent (informational→blog,
commercial→category/product). See `seo/data/keywords.csv` for the machine
-readable version.

> Data note: Google autocomplete/PAA and DataForSEO are not reachable from
> this session, so volume/difficulty numbers aren't attached yet. Priorities
> below are by strategic value + intent. Attach real numbers by dropping a
> GSC Performance export in `seo/data/gsc/` (free) or connecting DataForSEO
> (pay-as-you-go) — then re-run `/seo-team keywords`.

## Commercial clusters → existing money pages (fix these first)
These pages already exist but are thin/empty (see tech audit) — highest ROI
because ranking + conversion both improve:

| Cluster | Target page | State | Action |
|---|---|---|---|
| raw virgin bundles by texture (straight/body/loose/deep/curly) | /product-category/virgin-hair-bundles/ | live, no meta desc | On-Page: title/meta + guide + FAQ; consider per-texture sub-pages |
| tape-in extensions (for fine hair / for 4c / that won't damage edges) | /product-category/salon-products/tape-in/ | **empty** | assign products, then guide + FAQ |
| i-tip extensions (for thick hair / microlink) | /product-category/salon-products/i-tip/ | **empty** | assign products, then guide + FAQ |
| k-tip / keratin tip extensions | /product-category/salon-products/k-tip/ | **empty** | assign products, then guide + FAQ |
| wholesale hair / bulk bundles for stylists | /salon-pros/ | strong (1968 words) | add FAQ + wholesale keyword targeting |
| hair extensions Chicago | new /hair-extensions-chicago/ | missing | Local agent builds |

## Informational clusters → blog (queued, 2/week)
Priority order for the Blog agent:

1. **tape-in vs i-tip vs k-tip** (extension methods) — high intent, links to
   all three method categories.
2. **best bundles for 4c hair / texture-match** — plays to the strong
   coily-girl post; links to bundle categories.
3. **how long do tape-in extensions last** — method cluster.
4. **best shampoo for wigs and extensions** — links to care products.
5. **how to stop itchy scalp under a sew-in** — scalp cluster; links to
   scalp-reset page (found live at /scalp-reset/).
6. **edge growth oil that actually works** — links to Edge Entity.
7. **what to stock on a salon retail shelf** (Salon Pro / B2B).

## Refresh targets (existing 2024 posts → house style)
26 generic 2024 posts. Start with those whose topics map to a money page:
detangling/conditioner, microlink install/maintenance, growth supplements,
"products for Black hair" — refresh to the 2026 voice and add internal links
to the matching category/product.

## Notes
- Signature lines (Capri Silk, Belize Cascade, Bali Breeze, Persia Whirl,
  Fiji Coil) are individual products under one "Raw Hair Extensions"
  category. Opportunity: texture-named landing pages ("body wave bundles",
  "deep wave bundles") that rank commercially and link to the product.
- `/scalp-reset/` page exists — good hub anchor for the scalp cluster.
