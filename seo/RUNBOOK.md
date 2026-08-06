# Runbook — firing up the SEO team in any session

Everything needed to run the system travels in this repo
(`darielmarie-hash/lab`, branch `claude/seo-automation-strategy-tex418`).
Any Claude Code session with this repo attached inherits the whole team.
A mirror of this runbook lives in Google Drive for reference.

## 1. One-time: wire the WordPress key

The publish script reads three environment variables:

| Variable | Value |
|---|---|
| `WP_URL` | `https://casheshair.com` (default — can omit) |
| `WP_USERNAME` | Your WordPress login (the user shown as "Dariel Taylor" in wp-admin) |
| `WP_APP_PASSWORD` | An Application Password value (spaces are fine) |

**Where the key comes from.** wp-admin → Users → Profile → Application
Passwords lists existing names (Claude API, Cashe Blog Automation, …) but
WordPress shows each secret only once, at creation. Use an existing one only
if its value is saved somewhere (password manager / another app's config).
Otherwise type a name (e.g. `Claude SEO`) → Add Application Password → copy
the value shown. No new user or email is needed.

**Where to put it.** In the Claude Code environment settings, add
`WP_USERNAME` and `WP_APP_PASSWORD` as environment variables/secrets
(preferred — survives across sessions in that environment). Alternative for
a single session: tell Claude the values and have it export them in the
shell for that session only. Never commit them to the repo.

**Verify:** `python3 seo/scripts/wp_publish.py --check`
→ should print `OK — authenticated as ...`.

## 2. Running the team

Skill: `/seo-team <run>` (skill lives at .claude/skills/seo-team/).

- First ever run: `/seo-team first-run`
  (keywords → technical audit → analytics → GEO; produces the work queues)
- Weekly: `/seo-team weekly`
  (analytics → 5 refresh drafts → 2 blog drafts + social captions → report)
- Monthly extras: `/seo-team audit`, `/seo-team geo`, `/seo-team local`,
  `/seo-team outreach`

Every content item lands as a **draft** in wp-admin → Posts/Pages for
one-click approval. Outreach emails land in `seo/outreach/drafts/` — you
send them yourself.

## 3. Data feeds (all free)

- **Search Console / GA4:** already connected via Site Kit. For each
  analytics run, export GSC Performance (last 3 months, Queries + Pages,
  CSV) and drop the files in `seo/data/gsc/`. (A session with network
  access to Google APIs can automate this later; manual export works now.)
- Optional later: DataForSEO MCP (pay-as-you-go, cents per run) for
  volume/difficulty numbers.

## 4. Owner to-dos (one-time, ~1 hr total)

1. Yoast → Search Appearance: noindex product attribute archives + tag
   archives (index-bloat fix).
2. Fill the TODOs in `seo/voice/stories.md`, `stats.md`, `opinions.md` —
   this is what makes the content unmistakably Cashé's.
3. Confirm/claim Google Business Profile; keep the weekly post cadence
   using the generated social captions.
4. Approve drafts as they appear; the Friday report lists everything
   waiting on you.

## 5. Carrying to another session

- The repo branch is the system of record — push after each run
  (reports, keyword statuses, drafts-pending all live here).
- Google Drive holds a copy of this runbook + the strategy for quick
  reference from any device; the repo remains authoritative.
