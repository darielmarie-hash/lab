/* Cash's Hair Emporium — data store.
   All state lives in localStorage under one key so the dashboard and the
   public funnel page (funnel.html) share the same data with zero backend. */

const STORE_KEY = "che_platform_v1";

const PIPELINE_STAGES = ["New Lead", "Contacted", "Booked", "Showed", "Repeat Client"];

const SERVICES = [
  { name: "Silk Press", price: 85 },
  { name: "Knotless Braids", price: 220 },
  { name: "Quick Weave", price: 150 },
  { name: "Sew-In Install", price: 195 },
  { name: "Loc Retwist", price: 95 },
  { name: "Color + Cut", price: 140 },
  { name: "Kids' Style", price: 65 },
];

function seedData() {
  const now = new Date();
  const iso = (daysAgo, h = 10) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(h, 0, 0, 0);
    return d.toISOString();
  };
  const future = (daysAhead, h = 10) => {
    const d = new Date(now);
    d.setDate(d.getDate() + daysAhead);
    d.setHours(h, 0, 0, 0);
    return d.toISOString();
  };

  return {
    settings: {
      businessName: "Cash's Hair Emporium",
      tagline: "Luxury hair, without the wait.",
      owner: "Cash",
      phone: "(555) 014-2288",
      email: "book@cashshairemporium.com",
      address: "412 Crown Ave, Suite 3",
      avgTicket: 145,
    },
    contacts: [
      { id: "c1", name: "Tanya Brooks", phone: "(555) 201-8834", email: "tanya.b@example.com", tags: ["VIP", "Braids"], source: "Instagram Ads", createdAt: iso(94), lastVisit: iso(6), notes: "Prefers Saturday mornings. Sensitive scalp." },
      { id: "c2", name: "Maya Ellison", phone: "(555) 318-4402", email: "maya.e@example.com", tags: ["Silk Press"], source: "Google Ads", createdAt: iso(61), lastVisit: iso(12), notes: "" },
      { id: "c3", name: "Deja Winslow", phone: "(555) 407-9911", email: "deja.w@example.com", tags: ["New"], source: "Booking Funnel", createdAt: iso(2), lastVisit: null, notes: "Asked about knotless pricing." },
      { id: "c4", name: "Keisha Monroe", phone: "(555) 522-7345", email: "keisha.m@example.com", tags: ["VIP", "Color"], source: "Referral", createdAt: iso(210), lastVisit: iso(20), notes: "Refers a friend almost every month." },
      { id: "c5", name: "Alicia Grant", phone: "(555) 630-1187", email: "alicia.g@example.com", tags: ["Locs"], source: "Instagram Ads", createdAt: iso(45), lastVisit: iso(31), notes: "" },
      { id: "c6", name: "Simone Carter", phone: "(555) 745-6620", email: "simone.c@example.com", tags: ["New"], source: "Facebook Ads", createdAt: iso(4), lastVisit: null, notes: "Wants consult before install." },
      { id: "c7", name: "Renee Dawson", phone: "(555) 812-3390", email: "renee.d@example.com", tags: ["Weaves"], source: "Walk-in", createdAt: iso(120), lastVisit: iso(9), notes: "" },
      { id: "c8", name: "Jasmine Cole", phone: "(555) 908-1276", email: "jas.cole@example.com", tags: ["Braids"], source: "Booking Funnel", createdAt: iso(15), lastVisit: iso(15), notes: "Came from the summer special funnel." },
    ],
    opportunities: [
      { id: "o1", contact: "Deja Winslow", service: "Knotless Braids", value: 220, stage: "New Lead", source: "Booking Funnel", createdAt: iso(2) },
      { id: "o2", contact: "Simone Carter", service: "Sew-In Install", value: 195, stage: "Contacted", source: "Facebook Ads", createdAt: iso(4) },
      { id: "o3", contact: "Maya Ellison", service: "Silk Press", value: 85, stage: "Booked", source: "Google Ads", createdAt: iso(8) },
      { id: "o4", contact: "Alicia Grant", service: "Loc Retwist", value: 95, stage: "Booked", source: "Instagram Ads", createdAt: iso(5) },
      { id: "o5", contact: "Jasmine Cole", service: "Knotless Braids", value: 220, stage: "Showed", source: "Booking Funnel", createdAt: iso(15) },
      { id: "o6", contact: "Tanya Brooks", service: "Knotless Braids", value: 220, stage: "Repeat Client", source: "Instagram Ads", createdAt: iso(30) },
      { id: "o7", contact: "Keisha Monroe", service: "Color + Cut", value: 140, stage: "Repeat Client", source: "Referral", createdAt: iso(25) },
      { id: "o8", contact: "Renee Dawson", service: "Quick Weave", value: 150, stage: "Showed", source: "Walk-in", createdAt: iso(9) },
    ],
    appointments: [
      { id: "a1", contact: "Maya Ellison", service: "Silk Press", when: future(1, 10), staff: "Cash", status: "confirmed" },
      { id: "a2", contact: "Alicia Grant", service: "Loc Retwist", when: future(1, 13), staff: "Bri", status: "confirmed" },
      { id: "a3", contact: "Tanya Brooks", service: "Knotless Braids", when: future(2, 9), staff: "Cash", status: "confirmed" },
      { id: "a4", contact: "Deja Winslow", service: "Consultation", when: future(3, 11), staff: "Cash", status: "pending" },
      { id: "a5", contact: "Keisha Monroe", service: "Color + Cut", when: future(5, 14), staff: "Bri", status: "confirmed" },
      { id: "a6", contact: "Renee Dawson", service: "Quick Weave", when: iso(9, 12), staff: "Cash", status: "completed" },
    ],
    campaigns: [
      { id: "m1", name: "Summer Silk Press Special", platform: "Instagram", status: "active", spend: 420, impressions: 48200, clicks: 1370, leads: 41, revenue: 2890 },
      { id: "m2", name: "Knotless Braids — Book Now", platform: "Facebook", status: "active", spend: 380, impressions: 39400, clicks: 980, leads: 27, revenue: 3120 },
      { id: "m3", name: "\"Hair Near Me\" Search", platform: "Google", status: "active", spend: 310, impressions: 8900, clicks: 640, leads: 22, revenue: 1980 },
      { id: "m4", name: "Spring Referral Push", platform: "Instagram", status: "paused", spend: 250, impressions: 21000, clicks: 510, leads: 12, revenue: 940 },
    ],
    funnels: [
      {
        id: "f1", name: "New Client Booking Funnel", active: true, page: "funnel.html",
        steps: [
          { name: "Page Visits", count: 1840 },
          { name: "Clicked Book", count: 612 },
          { name: "Form Started", count: 355 },
          { name: "Lead Captured", count: 208 },
          { name: "Appointment Booked", count: 121 },
        ],
      },
      {
        id: "f2", name: "Win-Back: 60-Day No-Show", active: true, page: null,
        steps: [
          { name: "SMS Sent", count: 96 },
          { name: "Link Opened", count: 44 },
          { name: "Offer Claimed", count: 19 },
          { name: "Re-Booked", count: 14 },
        ],
      },
    ],
    automations: [
      { id: "w1", name: "Speed-to-Lead SMS", trigger: "New lead captured", action: "Send text within 60s with booking link", active: true, runs: 208 },
      { id: "w2", name: "Appointment Reminder", trigger: "24h before appointment", action: "SMS + email reminder with reschedule link", active: true, runs: 512 },
      { id: "w3", name: "No-Show Win-Back", trigger: "No visit in 60 days", action: "Send 15% comeback offer", active: true, runs: 96 },
      { id: "w4", name: "Review Request", trigger: "Appointment completed", action: "Text Google review link 2h after visit", active: true, runs: 341 },
      { id: "w5", name: "Birthday Offer", trigger: "Contact birthday", action: "Send free deep-condition upgrade coupon", active: false, runs: 58 },
    ],
    reviews: [
      { id: "r1", author: "Tanya B.", rating: 5, text: "Cash laid these braids PERFECTLY. Booked again before I left the chair.", date: iso(5), source: "Google", replied: true },
      { id: "r2", author: "Maya E.", rating: 5, text: "Best silk press in the city, no heat damage, lasted two weeks.", date: iso(11), source: "Google", replied: true },
      { id: "r3", author: "Renee D.", rating: 4, text: "Great quick weave. Waited a little past my slot but worth it.", date: iso(9), source: "Facebook", replied: false },
      { id: "r4", author: "Keisha M.", rating: 5, text: "The color is stunning. My whole office asked who did my hair.", date: iso(18), source: "Google", replied: true },
    ],
    activity: [
      { id: "e1", ts: iso(0, 9), text: "New lead captured from Booking Funnel: Deja Winslow", type: "lead" },
      { id: "e2", ts: iso(1, 15), text: "Speed-to-Lead SMS sent to Simone Carter", type: "automation" },
      { id: "e3", ts: iso(1, 11), text: "Maya Ellison booked Silk Press", type: "booking" },
      { id: "e4", ts: iso(2, 16), text: "New 5-star Google review from Tanya B.", type: "review" },
      { id: "e5", ts: iso(3, 10), text: "Instagram campaign spent $38 — 4 new leads", type: "ads" },
    ],
    // trailing 8 weeks of collected revenue, oldest first
    revenueWeekly: [
      { label: "W1", value: 1480 }, { label: "W2", value: 1720 }, { label: "W3", value: 1615 },
      { label: "W4", value: 1990 }, { label: "W5", value: 1870 }, { label: "W6", value: 2240 },
      { label: "W7", value: 2410 }, { label: "W8", value: 2685 },
    ],
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* corrupted store falls through to reseed */ }
  const fresh = seedData();
  saveState(fresh);
  return fresh;
}

function saveState(state) {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function resetState() {
  localStorage.removeItem(STORE_KEY);
  return loadState();
}

function uid(prefix) {
  return prefix + Math.random().toString(36).slice(2, 9);
}

function logActivity(state, text, type) {
  state.activity.unshift({ id: uid("e"), ts: new Date().toISOString(), text, type });
  state.activity = state.activity.slice(0, 40);
}

/* Shared by funnel.html: capture a public lead into the CRM. */
function captureLead(lead) {
  const state = loadState();
  const service = SERVICES.find((s) => s.name === lead.service);
  state.contacts.unshift({
    id: uid("c"), name: lead.name, phone: lead.phone, email: lead.email,
    tags: ["New"], source: "Booking Funnel", createdAt: new Date().toISOString(),
    lastVisit: null, notes: lead.notes || "",
  });
  state.opportunities.unshift({
    id: uid("o"), contact: lead.name, service: lead.service,
    value: service ? service.price : state.settings.avgTicket,
    stage: "New Lead", source: "Booking Funnel", createdAt: new Date().toISOString(),
  });
  const f = state.funnels.find((x) => x.id === "f1");
  if (f) {
    const captured = f.steps.find((s) => s.name === "Lead Captured");
    if (captured) captured.count += 1;
  }
  logActivity(state, `New lead captured from Booking Funnel: ${lead.name}`, "lead");
  saveState(state);
  return state;
}
