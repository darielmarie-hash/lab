# Cashé's Hair Emporium — SEO Automation Strategy (Zero New Software)

The plan for automating SEO on **casheshair.com** using only what you already
have: your Claude subscription, your WordPress/WooCommerce site, and free
Google services. Synthesized from four reference videos and a live audit of
the site (Aug 2026).

**The four videos, in one line each:**
1. *Claude Code SEO Workflow That Automates Traffic* — a weekly "SEO Content
   Autopilot" skill: bottom-of-funnel keywords → pillar content → interlinked
   money pages → repurpose the blog RSS into social posts.
2. *Claude Code SEO Masterclass ($500K / 50K clicks)* — the fundamentals:
   winning-keyword filters, keyword clusters, anti-slop voice files, SERP
   reverse-engineering, service×location "zipper" pages, an 80+ item on-page
   checklist, Lighthouse-to-100 technical loop, and off-page warnings.
3. *AI SEO Agent (GEO)* — generative engine optimization: audit → fix → re-audit
   so ChatGPT/Claude/Perplexity/AI Overviews actually recommend your business.
4. *Specialist SEO Team in 14 Minutes* — the org chart: 8 specialist agents +
   one orchestrator, grounded in real Search Console/Analytics/Business-Profile
   data, run on a schedule, human approval before anything publishes.

---

## 1. Live audit snapshot (Aug 2026)

| Component | Status | Why it matters |
|---|---|---|
| WordPress 7.0.2 + WooCommerce 11 | ✅ | Free REST API for automated publishing — no site rebuild needed (video 2's Next.js/Vercel build applies to new sites, not yours) |
| Yoast SEO (free) | ✅ | Sitemaps, titles/metas, robots.txt already handled |
| Site Kit by Google | ✅ | **Search Console + GA4 already connected** — your free data layer |
| Elementor | ✅ | Watch Lighthouse/page-speed weight (video 2's technical loop applies) |
| Jetpack (free) | ✅ | MCP write access needs a paid plan — skip it; use WP Application Passwords instead |

Content: **41 posts** — three strong 2026 posts (sew-in tangling, scalp care
under wigs, coily texture-match guide), ~26 generic 2024 posts, and a 19-month
publishing gap. **34 products** across 5 signature bundle lines (Capri Silk,
Belize Cascade, Bali Breeze, Persia Whirl, Fiji Coil), pro methods (I-Tip,
K-Tip, Tape-In, Hybrid Weft), Bee Girl, and growth/edge products. Product
metas are already decent; the blog and GEO layers are the opportunity.
Attribute archives (`pa_color`, `pa_length`, etc.) are in the sitemap — thin
pages to noindex. Two audiences: retail (largely textured/coily hair) and
**Salon Pros** (B2B). Plus a Chicago local identity, founded 2018.

## 2. Strategy core (what all four videos agree on)

- **Bottom-of-funnel first.** Target long, specific, high-intent queries —
  not "hair extensions" but "tape-in extensions that won't damage 4a edges."
  Blogs take informational intent; money pages take commercial intent.
- **Winning-keyword filter (video 2):** keyword difficulty ≤30, volume ≥100,
  right intent. Never let Claude guess keywords from thin air — feed it real
  data (Search Console first; see §5).
- **Keyword clusters:** every page targets a root keyword + a cluster of
  secondary variants so one page ranks for 50–100 queries.
- **The zipper, adapted (video 2).** For a plumber it's service×city; for
  Cashé's it's **texture × product line** ("body wave bundles for 4a hair",
  "best curly bundles for 4c blend") and **method × concern** ("tape-ins for
  fine hair", "k-tip vs i-tip for thick hair") — plus a Chicago layer.
  Tasteful count, not hundreds.
- **Interlinking ecosystem (video 1):** service/category pages ↔ high-intent
  blog posts, so a visitor landing on either can bounce to the other and buy.
  Blogs build topical authority that "raises the tide" for money pages.
- **Anti-slop voice system (video 2).** Reference files Claude loads before
  writing: `voice.md`, `stories.md`, `stats.md`, `opinions.md`, `humor.md` —
  built from Cashé's real story (Chicago, est. 2018), real product knowledge,
  customer anecdotes, and the tone of the three 2026 posts (the house style
  standard). Content is king; personality is why people stay on the page.
- **SERP reverse-engineering:** before writing any post, analyze the top-3
  ranking pages for the keyword and match the winning average (word count,
  H2 structure, topics, images).
- **GEO (video 3).** Optimize to be *recommended by AI engines*, not just
  ranked: Organization + LocalBusiness schema, quotable Q&A blocks on
  category/product pages, a plain-language About page, visible reviews with
  schema, and periodic "does AI recommend us?" checks. Expect a 14–21 day lag
  after fixes.
- **Human in the loop (video 4).** Nothing publishes itself. Everything lands
  as a WordPress **draft** for one-click approval in wp-admin.

## 3. The specialist team (video 4's org chart, adapted)

One orchestrator + specialists, built as skills/agents in this repo:

| Agent | Job | Output |
|---|---|---|
| **Intake** (run once) | Build `client.md`: business facts, services, brand voice, audiences | Context file every other agent reads |
| **Keyword Researcher** | Mine GSC queries + autocomplete/People-Also-Ask; apply the winning-keyword filter; cluster by intent and audience | `keywords.csv` + priority map |
| **Technical Auditor** | Lighthouse loop to ~100, sitemap/robots checks, index-bloat, broken links | Fix list → applied via drafts/patches |
| **Analytics Agent** | Synthesize GSC + GA4: striking-distance queries (pos. 5–20), decaying pages, CTR gaps | Weekly opportunities list |
| **GEO Agent** | Audit AI visibility, fix schema/Q&A/entity clarity, re-test the customer questions against AI engines | GEO fix list + citation log |
| **On-Page Copywriter** | Category/product page rewrites + 80-item on-page checklist (one H1, keyword in first 100 words, 3–5 internal links, 2–3 external, meta title/desc) while keeping the voice | WP drafts |
| **Blog Writer** | 2 posts/week from the keyword map: cluster + SERP analysis + voice files + free Pexels images; *asks you questions* about real experience before writing | WP drafts |
| **Local SEO** | Chicago page, LocalBusiness schema, Google Business Profile posts/updates | Drafts + GBP checklist |
| **Reporter** | Weekly scorecard: clicks/impressions/position deltas, AI citations, what shipped | `reports/seo-week-N.md` |

Run order for the first cycle (per video 4): keyword research → technical
audit → analytics → GEO report; their outputs become homework for the
copywriter, blog writer, and local agents; reporter closes the loop.

## 4. Publishing & indexing mechanics

- **Publish via WP REST API** (free, built into WordPress): create an
  Application Password (Users → Profile), then Claude POSTs drafts to
  `/wp-json/wp/v2/posts`. Confirmed live on casheshair.com.
- **Request indexing** for new/updated pages in Search Console's URL
  inspection (~10/day) — indexed in about a day instead of weeks.
- **Pace the ramp (video 2):** publishing cadence grows gradually (start
  ~2–3/week including refreshes); a sudden flood of pages reads as spam.
- **Social repurposing (video 1):** each published post gets 2–3 social
  captions generated from the blog RSS feed. Free scheduling via Jetpack
  Social (already installed) or Meta Business Suite — no Blotato needed.

## 5. Free replacements for every paid tool in the videos

| Videos' paid tool | Purpose | Your free path |
|---|---|---|
| Arvo | Article generation + auto-post | Claude writes; WP REST API publishes |
| Arvo backlink pool | Reciprocal backlinks | **Skip — link networks are the thing video 2 warns gets sites penalized** |
| Blotato | Social scheduling | Jetpack Social / Meta Business Suite |
| Semrush | Keyword volume/difficulty | GSC (real first-party queries) + Semrush free tier (~10 lookups/day) + autocomplete/PAA |
| Windsor.ai ($20/mo) | Pipe GSC/GA4/GBP into Claude | Google's own free APIs, or weekly CSV exports dropped into this repo — Site Kit already wired the accounts |
| DataForSEO | Live keyword/SERP/AI-visibility data | *Optional, pay-as-you-go pennies* (a research run costs cents; $5 minimum deposit). The one paid item worth considering later — not required to start |
| GEO audit SaaS | AI-visibility score | Claude runs the same checks directly (schema present? quotable answers? entity clarity?) + manual asks of ChatGPT/Claude/Perplexity |
| SEO agency ($1–20K/mo) | All of the above | The agent team in §3 |

## 6. Ranked priorities (maximum impact first)

1. **Noindex the attribute archives** (Yoast → Search Appearance; 1 hour).
2. **Striking-distance sprint:** GSC queries at positions 5–20 → one targeted
   edit each → request indexing. Fastest measurable win.
3. **Category pages as landing pages** for texture/method money keywords,
   each with buying guidance + FAQ schema (commercial-intent zipper pages).
4. **GEO fixes:** Organization/LocalBusiness schema, Q&A blocks, About-page
   entity clarity, review schema; then track AI citations monthly.
5. **Refresh the ~26 generic 2024 posts** to the 2026 house style (or merge
   and redirect); stale thin content drags the domain.
6. **New hub content, 2/week:** install & maintenance hub, texture-match hub,
   care-product hub, Salon Pro B2B hub — every post interlinked to money pages.
7. **Local layer:** Google Business Profile active + Chicago page.
8. **Earned links, sparingly:** broken-link swaps, guest posts, journalist
   queries. Never bought bulk backlinks/PBNs — video 2's strongest warning.

## 7. Operating cadence

**Weekly (~1 hr of your time):**
- Mon — Analytics + Reporter run: scorecard, striking-distance list.
- Tue — On-Page Copywriter submits 3–5 refresh drafts → approve.
- Wed — Blog Writer submits 2 post drafts (+ social captions) → approve;
  request indexing on everything published.
- Fri — 15-min review; queue next week's keywords.

**Monthly:** Technical audit; GEO re-check ("does AI recommend Cashé's
yet?"); refresh 4–6 old posts; review hub coverage.

**Scheduling:** Claude Code Routines or a GitHub Actions cron in this repo —
the video-4 pattern of a "fortnightly keyword map" routine, adapted.

**30/60/90 expectations:** 30 days — bloat fixed, 12–15 refreshes live, first
position gains. 60 days — category landing pages + GEO fixes shipped, 8+ hub
posts, refreshed posts hitting page one. 90 days — first hub complete, AI
citation checks turning up, the loop self-running on approvals.

## 8. What NOT to spend on

Rank trackers (GSC is first-party and free), AI-writing SaaS, paid SEO
plugins, bulk backlink services or "backlink pools" (Google treats link
schemes as spam — the one feature from the videos to actively avoid), and
agency retainers ($1–20K/mo for what §3 does).
