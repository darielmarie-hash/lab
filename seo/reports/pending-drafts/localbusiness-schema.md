# LocalBusiness schema + sew-in post meta fix — ready-to-paste

## 1. LocalBusiness JSON-LD (fixes the GEO "no local schema" gap)

Add sitewide (header/footer, or via a snippet plugin). Fill the ALL-CAPS
placeholders with real values — **do not publish with placeholders**, and
never invent an address. If there's no public storefront, use the
`"Chicago, IL"` locality with no street address and drop `streetAddress`.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "Cashé's Hair Emporium",
  "url": "https://casheshair.com/",
  "image": "https://casheshair.com/PATH-TO-LOGO.png",
  "description": "Chicago-based retailer of 100% raw virgin hair extensions and textured-hair care, for retail customers and licensed stylists since 2018.",
  "foundingDate": "2018",
  "areaServed": "Chicago, IL",
  "telephone": "PHONE-NUMBER",
  "email": "SUPPORT-EMAIL",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "STREET-ADDRESS-OR-REMOVE-THIS-LINE",
    "addressLocality": "Chicago",
    "addressRegion": "IL",
    "postalCode": "ZIP",
    "addressCountry": "US"
  },
  "sameAs": [
    "INSTAGRAM-URL",
    "FACEBOOK-URL",
    "TIKTOK-URL"
  ]
}
</script>
```

Why: AI engines and Google Local lean on `Store`/`LocalBusiness` + NAP to
answer "hair extensions Chicago" and "Black-owned hair vendor near me." The
site currently ships only `Organization` (no address/phone), so it's invisible
for local intent.

## 2. Sew-in post — meta description (currently missing)

**Post:** /how-to-keep-a-sew-in-from-tangling-and-matting/
Paste into the post's Yoast **Meta description** field:

> `Keep your sew-in smooth and matt-free: a stylist's routine for washing, moisturizing, and wrapping — plus the tangle mistakes to stop making. From Cashé's Hair Emporium.`

## 3. Sew-in post — duplicate H1 (fix)

The post renders its title as an H1 twice (theme template + in-content
heading). In the Elementor/template for single posts, ensure the title
prints once as H1 and any in-content repeat is H2 or removed. One H1 per page.

## 4. Homepage — double H1 (fix)

Homepage has two H1s ("Luxury hair, without the markup." and "Luxury hair.
No passport required."). Keep one as H1; demote the other to H2 in Elementor.
