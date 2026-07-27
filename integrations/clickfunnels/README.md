# ClickFunnels quiz tagging layer

Turns Find Your Match quiz answers into ClickFunnels contact tags automatically, so
segments, email sequences, and Workflows automations can key off `quiz_*` tags —
the main thing the Survey Workflows app would have provided, without rebuilding the quiz.

## What's here

| File | What it is |
|---|---|
| `quiz-tags.js` | The rules: which answers become which tags, what counts as a completed submission, which emails are test traffic |
| `cf-api.js` | Zero-dependency ClickFunnels 2.0 API client + the tag-reconcile routine |
| `worker.js` | Cloudflare Worker that receives `form.submission.created` webhooks and tags the contact live |
| `backfill.mjs` | One-off Node script to tag all historical respondents (dry-run by default) |
| `wrangler.toml` | Worker config (secrets excluded) |

## How it works

1. A visitor finishes the quiz → ClickFunnels records a form submission and fires a
   `form.submission.created` webhook to the worker.
2. The worker drops noise: `preview: true` rows, partial submissions (no
   `texture`/`recommended`), and `quiztest+*` test emails.
3. It reconciles the contact's tags to match the answers: `quiz_texture_deep_wave`,
   `quiz_porosity_medium`, `quiz_length_18`, `quiz_concern_thinning_edges`,
   `quiz_lifestyle_low_maintenance`, `quiz_recommended_persia_whirl`, plus
   `quiz_completed_2026_summer`. Missing tags are created on the fly (color `#48cdfe`,
   matching the existing taxonomy). If someone retakes the quiz with different
   answers, stale same-category tags are removed — latest submission wins. Non-quiz
   tags are never touched.

Duplicate submissions are harmless: reconciliation is idempotent, so the second
delivery finds nothing to change.

## Setup (one time, ~10 minutes)

1. **API token** — ClickFunnels: Team Settings → Developer Portal → create an API
   token. (The Claude connector's token can't be reused here; make a dedicated one.)
2. **Deploy the worker**
   ```bash
   cd integrations/clickfunnels
   npx wrangler deploy
   npx wrangler secret put CF_API_TOKEN     # paste the token
   npx wrangler secret put WEBHOOK_TOKEN    # any long random string
   ```
   Note the deployed URL, e.g. `https://cashes-quiz-tagger.<account>.workers.dev`.
3. **Point ClickFunnels at it** — create a webhook endpoint with URL
   `https://<worker-url>/?token=<WEBHOOK_TOKEN>` subscribed to the
   **form-submission.created** event. Either in the UI (Workspace Settings →
   Webhooks → Add New Endpoint) or ask Claude to create it via the API with the URL.
4. **Backfill history** (optional — recent respondents were already tagged manually,
   see below)
   ```bash
   CF_API_TOKEN=... CF_WORKSPACE_HOST=darieltaylorsteamwo4484a.myclickfunnels.com \
     CF_WORKSPACE_ID=432626 node backfill.mjs        # review the dry-run plan
   # then re-run with DRY_RUN=0 to apply
   ```
5. **Test** — take the quiz with a real-looking email, then check the contact in
   ClickFunnels: the `quiz_*` tags should appear within a few seconds.

## Current state (2026-07-27)

- The `quiz_*` tag taxonomy existed in the workspace (created 2026-05-28) but had
  never been applied to any contact. Gaps were filled: `quiz_porosity_low/medium/high`,
  `quiz_lifestyle_protective`, `quiz_length_20`, `quiz_length_26` now exist.
- The two real respondents visible in the recent submissions feed were tagged from
  their latest completed submission: `smasterstyler@sbcglobal.net` (7 tags) and
  `darielmtaylor@gmail.com` (8 tags). Test contacts (`quiztest+*`) were left untagged.
- Quiz answers also flow into each contact's custom attributes automatically —
  that was already working and is untouched by this layer.
- Heads-up from the data: the newest submission in the feed is 2026-06-01. If the
  quiz should be getting traffic, check that ads/links still point at
  quiz.casheshair.com and that the funnel is live.

## Automations this unlocks

With tags in place, ClickFunnels Workflows can trigger on **tag applied**, e.g.:
- `quiz_recommended_persia_whirl` applied → send the Persia Whirl follow-up sequence
- `quiz_concern_thinning_edges` applied → route into the care-guide nurture
- `quiz_completed_2026_summer` applied → 15%-off reminder if no order within 48h
