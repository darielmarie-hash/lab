# Cash's Hair Emporium — Growth Platform

A self-hosted CRM, funnel, and ads dashboard for **Cash's Hair Emporium** — a
GoHighLevel-style customer acquisition system with **no subscription** and no
backend required. Everything runs as static files: open it in a browser,
host it free on GitHub Pages, Netlify, or any static host.

## What's inside

| File | What it is |
|---|---|
| `index.html` | The owner dashboard (single-page app) |
| `funnel.html` | The public booking funnel — the customer acquisition landing page |
| `js/store.js` | Shared data layer (localStorage) used by both pages |
| `js/app.js` | Dashboard views, router, and interactions |
| `js/charts.js` | Zero-dependency SVG charts (line, bars, funnel) with hover tooltips |
| `css/app.css` | Dark luxe theme + validated chart palette |

## Modules

- **Dashboard** — revenue trend, lead sources, pipeline value, ROAS, upcoming appointments, live activity feed
- **Contacts** — searchable CRM with tags, sources, and add/delete
- **Pipeline** — drag-and-drop kanban: New Lead → Contacted → Booked → Showed → Repeat Client
- **Calendar** — appointment list with confirm/complete flow (completing a visit updates the contact's last-visit date)
- **Funnels** — step-by-step conversion breakdown for the booking funnel and the 60-day win-back sequence
- **Marketing & Ads** — campaign table with spend, CPL, ROAS, pause/resume, plus a spend-vs-revenue chart
- **Automations** — toggleable workflows (speed-to-lead SMS, reminders, review requests, win-backs)
- **Reputation** — review feed with average rating and one-click review requests
- **Settings** — business profile, JSON export/import, demo-data reset

## How the funnel feeds the CRM

`funnel.html` is the page you'd run ads to. When a visitor submits the booking
form, `captureLead()` in `js/store.js` writes them into the same localStorage
store the dashboard reads: a new **contact** (tagged `New`, source `Booking
Funnel`), a new **opportunity** in the *New Lead* pipeline stage, a funnel-step
increment, and an activity-feed entry. Open the dashboard in another tab and
the new lead appears immediately (cross-tab `storage` events re-render).

## Switching from demo data to your real business

1. **Settings → Business Profile** — enter your real name, phone, address, and
   average ticket, then Save.
2. **Settings → Services & Pricing** — edit the menu to your real services and
   prices. The booking funnel and all booking forms update automatically.
3. **Settings → Start Fresh (clear demo data)** — removes every demo contact,
   appointment, campaign, and review while keeping your profile, services, and
   automations.
4. **Contacts → Import CSV** — bulk-load your existing client list. The file
   needs a header row; `name` is required, and `phone`, `email`, `tags`, and
   `source` columns are picked up automatically in any order (separate multiple
   tags with `;`). Example:

   ```csv
   name,phone,email,tags,source
   Tanya Brooks,(555) 201-8834,tanya@example.com,VIP;Braids,Referral
   ```

5. From then on, real data accumulates on its own: leads arrive through the
   booking funnel, appointments through Calendar, and ad results through
   Marketing → New Campaign (update spend/leads/revenue as your ads run).
6. **Settings → Export JSON** regularly — that file is your backup.

## Running it

No build step, no install:

```bash
# any static server works; from the repo root:
python3 -m http.server 8080
# then open http://localhost:8080
```

Or just open `index.html` directly in a browser. Data persists per-browser in
localStorage; use **Settings → Export JSON** to back it up or move it.

## Taking it to production

This is a fully working single-operator system as-is, but a few things are
simulated because static hosting has no server:

1. **SMS/email automations** — the workflow toggles are real, the sends are not.
   Wire the triggers to Twilio (SMS) and any SMTP relay, or point the booking
   form at a serverless function (Cloudflare Workers / Netlify Functions are
   free-tier friendly).
2. **Shared data across devices** — localStorage is per-browser. Swap
   `js/store.js`'s `loadState`/`saveState` for a small API backed by SQLite or
   Supabase (free tier) to share data between the shop computer and your phone.
3. **Ad metrics** — campaign numbers are entered manually. The Meta and Google
   Ads APIs can populate them automatically once you have API access.

## Customizing

- **Services & pricing** — edit `SERVICES` in `js/store.js`; the funnel page and
  booking forms pick the changes up automatically.
- **Branding** — colors live as CSS custom properties at the top of
  `css/app.css` and in the `<style>` block of `funnel.html`.
- **Pipeline stages** — edit `PIPELINE_STAGES` in `js/store.js`.
- **Demo data** — `seedData()` in `js/store.js`; Settings → Reset restores it.
