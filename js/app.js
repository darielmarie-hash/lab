import { lineChart, hBarChart, groupedBarChart, funnelChart } from "./charts.js";

/* store.js is a plain script (shared with funnel.html), loaded before this module */
let state = loadState();

const $ = (sel, root = document) => root.querySelector(sel);
const main = $("#view");
const money = (n) => "$" + Math.round(n).toLocaleString("en-US");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function commit() { saveState(state); }

function toast(msg) {
  document.querySelectorAll(".toast").forEach((t) => t.remove());
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

function openModal(title, bodyHTML, onSubmit, submitLabel = "Save") {
  const back = document.createElement("div");
  back.className = "modal-backdrop";
  back.innerHTML = `
    <form class="modal">
      <h3>${esc(title)}</h3>
      ${bodyHTML}
      <div class="modal-actions">
        <button type="button" class="btn" data-close>Cancel</button>
        <button type="submit" class="btn primary">${esc(submitLabel)}</button>
      </div>
    </form>`;
  document.body.appendChild(back);
  const close = () => back.remove();
  back.addEventListener("click", (e) => { if (e.target === back) close(); });
  back.querySelector("[data-close]").addEventListener("click", close);
  back.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    if (onSubmit(data) !== false) close();
  });
  const first = back.querySelector("input, select, textarea");
  if (first) first.focus();
}

const fmtDate = (isoStr) => new Date(isoStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const fmtDateTime = (isoStr) => new Date(isoStr).toLocaleString("en-US",
  { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

/* ---------------- derived metrics ---------------- */

function metrics() {
  const adSpend = state.campaigns.reduce((a, c) => a + c.spend, 0);
  const adRevenue = state.campaigns.reduce((a, c) => a + c.revenue, 0);
  const leads = state.campaigns.reduce((a, c) => a + c.leads, 0);
  const pipelineValue = state.opportunities
    .filter((o) => !["Showed", "Repeat Client"].includes(o.stage))
    .reduce((a, o) => a + o.value, 0);
  const revenue = state.revenueWeekly.reduce((a, w) => a + w.value, 0);
  const upcoming = state.appointments.filter(
    (a) => new Date(a.when) > new Date() && a.status !== "cancelled").length;
  const newLeads30 = state.contacts.filter(
    (c) => (Date.now() - new Date(c.createdAt)) / 86400000 <= 30).length;
  const avgRating = state.reviews.length
    ? (state.reviews.reduce((a, r) => a + r.rating, 0) / state.reviews.length) : 0;
  return { adSpend, adRevenue, leads, pipelineValue, revenue, upcoming, newLeads30, avgRating };
}

function leadSources() {
  const counts = {};
  state.contacts.forEach((c) => { counts[c.source] = (counts[c.source] || 0) + 1; });
  return Object.entries(counts).map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

/* ---------------- views ---------------- */

function viewDashboard() {
  const m = metrics();
  const roas = m.adSpend ? (m.adRevenue / m.adSpend).toFixed(1) : "—";
  main.innerHTML = `
    <div class="page-head">
      <div><h1 class="page-title">Dashboard</h1>
      <p class="page-sub">${esc(state.settings.businessName)} — customer acquisition at a glance</p></div>
      <a class="btn primary" href="funnel.html" target="_blank">View Booking Funnel ↗</a>
    </div>
    <div class="grid kpis">
      <div class="card kpi"><div class="kpi-label">Revenue (8 weeks)</div>
        <div class="kpi-value">${money(m.revenue)}</div>
        <div class="kpi-delta ${state.revenueWeekly[0].value ? "up" : ""}">${state.revenueWeekly[0].value
          ? "↑ " + Math.round(((state.revenueWeekly.at(-1).value / state.revenueWeekly[0].value) - 1) * 100) + "% vs first week"
          : "No revenue recorded yet"}</div></div>
      <div class="card kpi"><div class="kpi-label">New Leads (30 days)</div>
        <div class="kpi-value">${m.newLeads30}</div>
        <div class="kpi-delta">${m.leads} total from paid ads</div></div>
      <div class="card kpi"><div class="kpi-label">Pipeline Value</div>
        <div class="kpi-value">${money(m.pipelineValue)}</div>
        <div class="kpi-delta">${state.opportunities.length} open opportunities</div></div>
      <div class="card kpi"><div class="kpi-label">Ad ROAS</div>
        <div class="kpi-value">${roas}×</div>
        <div class="kpi-delta">${money(m.adSpend)} spend → ${money(m.adRevenue)} booked</div></div>
    </div>
    <div class="grid two section-gap">
      <div class="card"><h3>Weekly Collected Revenue</h3>
        <p class="card-sub">Trailing 8 weeks</p><div id="rev-chart"></div></div>
      <div class="card"><h3>Lead Sources</h3>
        <p class="card-sub">Where contacts come from</p><div id="src-chart"></div></div>
    </div>
    <div class="grid two section-gap">
      <div class="card"><h3>Upcoming Appointments</h3>
        <p class="card-sub">${m.upcoming} on the books</p><div id="dash-appts"></div></div>
      <div class="card"><h3>Recent Activity</h3>
        <p class="card-sub">Leads, bookings, automations</p><div id="dash-activity"></div></div>
    </div>`;

  lineChart($("#rev-chart"), state.revenueWeekly);
  hBarChart($("#src-chart"), leadSources());

  const upcoming = state.appointments
    .filter((a) => new Date(a.when) > new Date() && a.status !== "cancelled")
    .sort((a, b) => new Date(a.when) - new Date(b.when)).slice(0, 4);
  $("#dash-appts").innerHTML = upcoming.length ? upcoming.map((a) => `
    <div class="appt-row">
      <div class="appt-when"><div class="d">${fmtDate(a.when)}</div>
        <div class="t">${new Date(a.when).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</div></div>
      <div class="appt-main"><div class="who">${esc(a.contact)}</div>
        <div class="what">${esc(a.service)} · with ${esc(a.staff)}</div></div>
      <span class="chip ${a.status === "confirmed" ? "status-active" : ""}">${esc(a.status)}</span>
    </div>`).join("") : `<div class="empty">No upcoming appointments</div>`;

  const dotColor = { lead: "var(--series-2)", booking: "var(--gold-strong)", automation: "var(--series-1)", review: "var(--series-3)", ads: "var(--series-5)" };
  $("#dash-activity").innerHTML = state.activity.slice(0, 6).map((e) => `
    <div class="activity-item">
      <span class="activity-dot" style="background:${dotColor[e.type] || "var(--ink-3)"}"></span>
      <div>${esc(e.text)}<div class="activity-time">${fmtDateTime(e.ts)}</div></div>
    </div>`).join("");
}

function viewContacts() {
  main.innerHTML = `
    <div class="page-head">
      <div><h1 class="page-title">Contacts</h1>
      <p class="page-sub">${state.contacts.length} contacts in your CRM</p></div>
      <div class="toolbar">
        <input type="search" id="contact-q" placeholder="Search name, tag, source…">
        <button class="btn" id="import-csv">Import CSV</button>
        <button class="btn primary" id="add-contact">+ Add Contact</button>
        <input type="file" id="csv-file" accept=".csv,text/csv" style="display:none">
      </div>
    </div>
    <div class="card table-wrap">
      <table><thead><tr>
        <th>Name</th><th>Phone</th><th>Tags</th><th>Source</th>
        <th>Last Visit</th><th></th>
      </tr></thead><tbody id="contact-rows"></tbody></table>
    </div>`;

  const render = (q = "") => {
    const rows = state.contacts.filter((c) =>
      [c.name, c.email, c.source, ...(c.tags || [])].join(" ").toLowerCase().includes(q.toLowerCase()));
    $("#contact-rows").innerHTML = rows.length ? rows.map((c) => `
      <tr>
        <td><strong>${esc(c.name)}</strong><br><span style="color:var(--ink-3);font-size:12px">${esc(c.email)}</span></td>
        <td>${esc(c.phone)}</td>
        <td>${(c.tags || []).map((t) => `<span class="chip ${t === "VIP" ? "gold" : ""}">${esc(t)}</span>`).join("")}</td>
        <td>${esc(c.source)}</td>
        <td>${c.lastVisit ? fmtDate(c.lastVisit) : "—"}</td>
        <td style="text-align:right"><button class="btn small danger" data-del="${c.id}">Delete</button></td>
      </tr>`).join("") : `<tr><td colspan="6" class="empty">No contacts match</td></tr>`;
    $("#contact-rows").querySelectorAll("[data-del]").forEach((b) =>
      b.addEventListener("click", () => {
        const c = state.contacts.find((x) => x.id === b.dataset.del);
        if (!confirm(`Delete ${c.name}? This can't be undone.`)) return;
        state.contacts = state.contacts.filter((x) => x.id !== c.id);
        commit(); render($("#contact-q").value); toast("Contact deleted");
      }));
  };
  render();
  $("#contact-q").addEventListener("input", (e) => render(e.target.value));
  $("#add-contact").addEventListener("click", () =>
    openModal("Add Contact", `
      <div class="field"><label>Full name</label><input name="name" required></div>
      <div class="field"><label>Phone</label><input name="phone" required></div>
      <div class="field"><label>Email</label><input name="email" type="email"></div>
      <div class="field"><label>Source</label><select name="source">
        <option>Walk-in</option><option>Referral</option><option>Instagram Ads</option>
        <option>Facebook Ads</option><option>Google Ads</option><option>Booking Funnel</option>
      </select></div>
      <div class="field"><label>Tags (comma separated)</label><input name="tags" placeholder="VIP, Braids"></div>`,
      (d) => {
        state.contacts.unshift({
          id: uid("c"), name: d.name, phone: d.phone, email: d.email || "",
          tags: d.tags ? d.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
          source: d.source, createdAt: new Date().toISOString(), lastVisit: null, notes: "",
        });
        logActivity(state, `Contact added manually: ${d.name}`, "lead");
        commit(); render(); toast("Contact added");
      }));

  $("#import-csv").addEventListener("click", () => $("#csv-file").click());
  $("#csv-file").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    file.text().then((txt) => {
      const added = importContactsCSV(txt);
      e.target.value = "";
      if (added === 0) { toast("No contacts found — the CSV needs a header row with a “name” column"); return; }
      commit(); render(); toast(`Imported ${added} contact${added === 1 ? "" : "s"}`);
    });
  });
}

/* CSV import: expects a header row; recognizes name, phone, email, tags,
   source columns (any order, case-insensitive). Handles quoted fields. */
function parseCSVLine(line) {
  const out = [];
  let cur = "", inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') inQ = false;
      else cur += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ",") { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function importContactsCSV(txt) {
  const lines = txt.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return 0;
  const header = parseCSVLine(lines[0]).map((h) => h.toLowerCase());
  const col = (name) => header.findIndex((h) => h.includes(name));
  const iName = col("name"), iPhone = col("phone"), iEmail = col("email"),
    iTags = col("tag"), iSource = col("source");
  if (iName === -1) return 0;
  let added = 0;
  for (const line of lines.slice(1)) {
    const cells = parseCSVLine(line);
    const name = cells[iName];
    if (!name) continue;
    state.contacts.unshift({
      id: uid("c"), name,
      phone: iPhone !== -1 ? cells[iPhone] || "" : "",
      email: iEmail !== -1 ? cells[iEmail] || "" : "",
      tags: iTags !== -1 && cells[iTags] ? cells[iTags].split(/[;|]/).map((t) => t.trim()).filter(Boolean) : [],
      source: iSource !== -1 && cells[iSource] ? cells[iSource] : "Import",
      createdAt: new Date().toISOString(), lastVisit: null, notes: "",
    });
    added++;
  }
  if (added) logActivity(state, `Imported ${added} contacts from CSV`, "lead");
  return added;
}

function viewPipeline() {
  main.innerHTML = `
    <div class="page-head">
      <div><h1 class="page-title">Pipeline</h1>
      <p class="page-sub">Drag opportunities between stages</p></div>
      <button class="btn primary" id="add-opp">+ New Opportunity</button>
    </div>
    <div class="board" id="board"></div>`;

  const render = () => {
    $("#board").innerHTML = PIPELINE_STAGES.map((stage) => {
      const opps = state.opportunities.filter((o) => o.stage === stage);
      const total = opps.reduce((a, o) => a + o.value, 0);
      return `<div class="stage-col" data-stage="${esc(stage)}">
        <div class="stage-head"><span class="stage-name">${esc(stage)}</span>
          <span class="stage-total">${money(total)}</span></div>
        ${opps.map((o) => `
          <div class="opp-card" draggable="true" data-opp="${o.id}">
            <div class="opp-name">${esc(o.contact)}</div>
            <div class="opp-meta">${esc(o.service)} · ${esc(o.source)}</div>
            <div class="opp-value">${money(o.value)}</div>
          </div>`).join("")}
      </div>`;
    }).join("");

    $("#board").querySelectorAll(".opp-card").forEach((card) => {
      card.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/plain", card.dataset.opp));
    });
    $("#board").querySelectorAll(".stage-col").forEach((col) => {
      col.addEventListener("dragover", (e) => { e.preventDefault(); col.classList.add("drag-over"); });
      col.addEventListener("dragleave", () => col.classList.remove("drag-over"));
      col.addEventListener("drop", (e) => {
        e.preventDefault(); col.classList.remove("drag-over");
        const opp = state.opportunities.find((o) => o.id === e.dataTransfer.getData("text/plain"));
        if (opp && opp.stage !== col.dataset.stage) {
          opp.stage = col.dataset.stage;
          logActivity(state, `${opp.contact} moved to ${opp.stage}`, "booking");
          commit(); render();
        }
      });
    });
  };
  render();

  $("#add-opp").addEventListener("click", () =>
    openModal("New Opportunity", `
      <div class="field"><label>Contact name</label><input name="contact" required list="contact-names">
        <datalist id="contact-names">${state.contacts.map((c) => `<option value="${esc(c.name)}">`).join("")}</datalist></div>
      <div class="field"><label>Service</label><select name="service">
        ${getServices(state).map((s) => `<option value="${esc(s.name)}">${esc(s.name)} — ${money(s.price)}</option>`).join("")}
      </select></div>
      <div class="field"><label>Source</label><select name="source">
        <option>Booking Funnel</option><option>Instagram Ads</option><option>Facebook Ads</option>
        <option>Google Ads</option><option>Referral</option><option>Walk-in</option>
      </select></div>`,
      (d) => {
        const svc = getServices(state).find((s) => s.name === d.service);
        state.opportunities.unshift({
          id: uid("o"), contact: d.contact, service: d.service,
          value: svc ? svc.price : state.settings.avgTicket,
          stage: "New Lead", source: d.source, createdAt: new Date().toISOString(),
        });
        logActivity(state, `New opportunity: ${d.contact} — ${d.service}`, "lead");
        commit(); render(); toast("Opportunity created");
      }, "Create"));
}

function viewCalendar() {
  main.innerHTML = `
    <div class="page-head">
      <div><h1 class="page-title">Calendar</h1>
      <p class="page-sub">Appointments, soonest first</p></div>
      <button class="btn primary" id="add-appt">+ Book Appointment</button>
    </div>
    <div class="card" id="appt-list"></div>`;

  const render = () => {
    const appts = [...state.appointments].sort((a, b) => new Date(a.when) - new Date(b.when));
    $("#appt-list").innerHTML = appts.length ? appts.map((a) => `
      <div class="appt-row">
        <div class="appt-when"><div class="d">${fmtDate(a.when)}</div>
          <div class="t">${new Date(a.when).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</div></div>
        <div class="appt-main"><div class="who">${esc(a.contact)}</div>
          <div class="what">${esc(a.service)} · with ${esc(a.staff)}</div></div>
        <span class="chip ${a.status === "confirmed" ? "status-active" : a.status === "pending" ? "status-paused" : ""}">${esc(a.status)}</span>
        ${a.status !== "completed" && a.status !== "cancelled"
          ? `<button class="btn small" data-done="${a.id}">Mark done</button>` : ""}
      </div>`).join("") : `<div class="empty">Nothing booked yet</div>`;
    $("#appt-list").querySelectorAll("[data-done]").forEach((b) =>
      b.addEventListener("click", () => {
        const a = state.appointments.find((x) => x.id === b.dataset.done);
        a.status = "completed";
        const contact = state.contacts.find((c) => c.name === a.contact);
        if (contact) contact.lastVisit = new Date().toISOString();
        logActivity(state, `${a.contact} completed ${a.service} — review request queued`, "automation");
        commit(); render(); toast("Marked complete — review request queued");
      }));
  };
  render();

  $("#add-appt").addEventListener("click", () =>
    openModal("Book Appointment", `
      <div class="field"><label>Contact name</label><input name="contact" required list="contact-names2">
        <datalist id="contact-names2">${state.contacts.map((c) => `<option value="${esc(c.name)}">`).join("")}</datalist></div>
      <div class="field"><label>Service</label><select name="service">
        ${getServices(state).map((s) => `<option>${esc(s.name)}</option>`).join("")}<option>Consultation</option>
      </select></div>
      <div class="field"><label>Date & time</label><input name="when" type="datetime-local" required></div>
      <div class="field"><label>Stylist</label><select name="staff"><option>Cash</option><option>Bri</option></select></div>`,
      (d) => {
        state.appointments.push({
          id: uid("a"), contact: d.contact, service: d.service,
          when: new Date(d.when).toISOString(), staff: d.staff, status: "confirmed",
        });
        logActivity(state, `${d.contact} booked ${d.service}`, "booking");
        commit(); render(); toast("Appointment booked");
      }, "Book"));
}

function viewFunnels() {
  main.innerHTML = `
    <div class="page-head">
      <div><h1 class="page-title">Funnels</h1>
      <p class="page-sub">Conversion from first click to booked appointment</p></div>
    </div>
    <div class="grid halves">${state.funnels.map((f) => {
      const rate = f.steps[0].count ? Math.round((f.steps.at(-1).count / f.steps[0].count) * 100) : 0;
      return `<div class="card">
        <h3>${esc(f.name)} <span class="chip ${f.active ? "status-active" : "status-paused"}">${f.active ? "live" : "off"}</span></h3>
        <p class="card-sub">${rate}% end-to-end conversion${f.page ? ` · <a href="${esc(f.page)}" target="_blank">open page ↗</a>` : ""}</p>
        <div id="funnel-${f.id}"></div>
      </div>`;
    }).join("")}</div>`;
  state.funnels.forEach((f) => funnelChart($(`#funnel-${f.id}`), f.steps));
}

function viewMarketing() {
  const m = metrics();
  main.innerHTML = `
    <div class="page-head">
      <div><h1 class="page-title">Marketing & Ads</h1>
      <p class="page-sub">Every dollar in, every dollar back</p></div>
      <button class="btn primary" id="add-camp">+ New Campaign</button>
    </div>
    <div class="grid kpis">
      <div class="card kpi"><div class="kpi-label">Total Spend</div><div class="kpi-value">${money(m.adSpend)}</div></div>
      <div class="card kpi"><div class="kpi-label">Attributed Revenue</div><div class="kpi-value">${money(m.adRevenue)}</div></div>
      <div class="card kpi"><div class="kpi-label">Leads</div><div class="kpi-value">${m.leads}</div>
        <div class="kpi-delta">${money(m.adSpend / Math.max(m.leads, 1))} avg cost per lead</div></div>
      <div class="card kpi"><div class="kpi-label">Blended ROAS</div>
        <div class="kpi-value">${(m.adRevenue / Math.max(m.adSpend, 1)).toFixed(1)}×</div></div>
    </div>
    <div class="card section-gap"><h3>Spend vs Revenue by Campaign</h3>
      <p class="card-sub">Both in dollars, one axis</p><div id="camp-chart"></div></div>
    <div class="card section-gap table-wrap">
      <table><thead><tr>
        <th>Campaign</th><th>Platform</th><th>Status</th>
        <th class="num">Spend</th><th class="num">Clicks</th><th class="num">Leads</th>
        <th class="num">CPL</th><th class="num">Revenue</th><th class="num">ROAS</th><th></th>
      </tr></thead><tbody id="camp-rows"></tbody></table>
    </div>`;

  groupedBarChart($("#camp-chart"),
    state.campaigns.map((c) => ({ label: c.name, values: [c.spend, c.revenue] })),
    ["Spend", "Revenue"]);

  const render = () => {
    $("#camp-rows").innerHTML = state.campaigns.map((c) => `
      <tr>
        <td><strong>${esc(c.name)}</strong></td>
        <td>${esc(c.platform)}</td>
        <td><span class="chip status-${c.status}">${esc(c.status)}</span></td>
        <td class="num">${money(c.spend)}</td>
        <td class="num">${c.clicks.toLocaleString("en-US")}</td>
        <td class="num">${c.leads}</td>
        <td class="num">${money(c.spend / Math.max(c.leads, 1))}</td>
        <td class="num">${money(c.revenue)}</td>
        <td class="num"><strong>${(c.revenue / Math.max(c.spend, 1)).toFixed(1)}×</strong></td>
        <td><button class="btn small" data-toggle="${c.id}">${c.status === "active" ? "Pause" : "Resume"}</button></td>
      </tr>`).join("");
    $("#camp-rows").querySelectorAll("[data-toggle]").forEach((b) =>
      b.addEventListener("click", () => {
        const c = state.campaigns.find((x) => x.id === b.dataset.toggle);
        c.status = c.status === "active" ? "paused" : "active";
        logActivity(state, `Campaign ${c.status === "active" ? "resumed" : "paused"}: ${c.name}`, "ads");
        commit(); render();
      }));
  };
  render();

  $("#add-camp").addEventListener("click", () =>
    openModal("New Campaign", `
      <div class="field"><label>Campaign name</label><input name="name" required></div>
      <div class="field"><label>Platform</label><select name="platform">
        <option>Instagram</option><option>Facebook</option><option>Google</option><option>TikTok</option></select></div>
      <div class="field"><label>Starting budget ($)</label><input name="spend" type="number" min="0" value="100"></div>`,
      (d) => {
        state.campaigns.push({
          id: uid("m"), name: d.name, platform: d.platform, status: "active",
          spend: Number(d.spend) || 0, impressions: 0, clicks: 0, leads: 0, revenue: 0,
        });
        logActivity(state, `Campaign launched: ${d.name} (${d.platform})`, "ads");
        commit(); viewMarketing(); toast("Campaign created");
      }, "Launch"));
}

function viewAutomations() {
  main.innerHTML = `
    <div class="page-head">
      <div><h1 class="page-title">Automations</h1>
      <p class="page-sub">Workflows that follow up so you don't have to</p></div>
    </div>
    <div class="card" id="auto-list"></div>
    <p class="page-sub section-gap">In this self-hosted demo, workflows are simulated. Wire the triggers to
    Twilio (SMS) and an SMTP relay to send for real — see the README.</p>`;
  const render = () => {
    $("#auto-list").innerHTML = state.automations.map((w) => `
      <div class="auto-row">
        <div class="auto-main"><div class="auto-name">${esc(w.name)}</div>
          <div class="auto-desc">When <strong>${esc(w.trigger)}</strong> → ${esc(w.action)} · ${w.runs} runs</div></div>
        <label class="switch"><input type="checkbox" data-auto="${w.id}" ${w.active ? "checked" : ""}><span class="track"></span></label>
      </div>`).join("");
    $("#auto-list").querySelectorAll("[data-auto]").forEach((cb) =>
      cb.addEventListener("change", () => {
        const w = state.automations.find((x) => x.id === cb.dataset.auto);
        w.active = cb.checked;
        commit(); toast(`${w.name} ${w.active ? "enabled" : "disabled"}`);
      }));
  };
  render();
}

function viewReviews() {
  const m = metrics();
  main.innerHTML = `
    <div class="page-head">
      <div><h1 class="page-title">Reputation</h1>
      <p class="page-sub">★ ${m.avgRating.toFixed(1)} average across ${state.reviews.length} reviews</p></div>
      <button class="btn primary" id="req-review">Send Review Requests</button>
    </div>
    <div class="card" id="review-list"></div>`;
  $("#review-list").innerHTML = state.reviews.map((r) => `
    <div class="review-card">
      <div class="stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
      <div style="margin:4px 0">${esc(r.text)}</div>
      <div class="review-meta">${esc(r.author)} · ${esc(r.source)} · ${fmtDate(r.date)}
        ${r.replied ? '· <span style="color:var(--gold-strong)">replied</span>' : ""}</div>
    </div>`).join("");
  $("#req-review").addEventListener("click", () => {
    const recent = state.appointments.filter((a) => a.status === "completed").length;
    logActivity(state, `Review requests sent to ${recent} recent clients`, "automation");
    commit(); toast(`Review request queued for ${recent} recent client${recent === 1 ? "" : "s"}`);
  });
}

function viewSettings() {
  const s = state.settings;
  main.innerHTML = `
    <div class="page-head"><div><h1 class="page-title">Settings</h1>
      <p class="page-sub">Business profile & data</p></div></div>
    <div class="grid halves">
      <div class="card"><h3>Business Profile</h3><p class="card-sub">Shown on the booking funnel</p>
        <form id="settings-form">
          <div class="field"><label>Business name</label><input name="businessName" value="${esc(s.businessName)}"></div>
          <div class="field"><label>Tagline</label><input name="tagline" value="${esc(s.tagline)}"></div>
          <div class="field"><label>Phone</label><input name="phone" value="${esc(s.phone)}"></div>
          <div class="field"><label>Email</label><input name="email" value="${esc(s.email)}"></div>
          <div class="field"><label>Address</label><input name="address" value="${esc(s.address)}"></div>
          <div class="field"><label>Average ticket ($)</label><input name="avgTicket" type="number" value="${s.avgTicket}"></div>
          <button class="btn primary" type="submit">Save Profile</button>
        </form></div>
      <div>
        <div class="card"><h3>Services & Pricing</h3><p class="card-sub">Drives the booking funnel and every booking form</p>
          <div id="svc-rows"></div>
          <div class="toolbar" style="margin-top:12px">
            <button class="btn" id="svc-add">+ Add Service</button>
            <button class="btn primary" id="svc-save">Save Services</button>
          </div>
        </div>
        <div class="card section-gap"><h3>Your Data</h3><p class="card-sub">Everything is stored locally — no subscription, no vendor lock-in</p>
          <div class="toolbar" style="margin-top:8px">
            <button class="btn" id="export-data">Export JSON</button>
            <button class="btn" id="import-data">Import JSON</button>
          </div>
          <div class="toolbar" style="margin-top:10px">
            <button class="btn danger" id="clear-data">Start Fresh (clear demo data)</button>
            <button class="btn" id="reset-data">Restore Demo Data</button>
          </div>
          <p class="page-sub" style="margin-top:10px">Start Fresh keeps your business profile, services, and
            automations but removes all demo contacts, appointments, campaigns, and reviews — then add real
            clients by hand or with <strong>Contacts → Import CSV</strong>.</p>
          <input type="file" id="import-file" accept=".json" style="display:none">
        </div>
      </div>
    </div>`;

  const renderSvcRows = () => {
    $("#svc-rows").innerHTML = getServices(state).map((svc, i) => `
      <div class="toolbar" style="margin-top:8px">
        <input data-svc-name="${i}" value="${esc(svc.name)}" placeholder="Service name" style="flex:1">
        <input data-svc-price="${i}" type="number" min="0" value="${svc.price}" style="width:90px">
        <button type="button" class="btn small danger" data-svc-del="${i}">✕</button>
      </div>`).join("");
    $("#svc-rows").querySelectorAll("[data-svc-del]").forEach((b) =>
      b.addEventListener("click", () => {
        state.settings.services = getServices(state).filter((_, i) => i !== Number(b.dataset.svcDel));
        renderSvcRows();
      }));
  };
  renderSvcRows();
  $("#svc-add").addEventListener("click", () => {
    state.settings.services = [...getServices(state), { name: "", price: 0 }];
    renderSvcRows();
  });
  $("#svc-save").addEventListener("click", () => {
    const rows = [...$("#svc-rows").querySelectorAll("[data-svc-name]")].map((inp, i) => ({
      name: inp.value.trim(),
      price: Number($(`[data-svc-price="${i}"]`).value) || 0,
    })).filter((svc) => svc.name);
    state.settings.services = rows;
    commit(); renderSvcRows(); toast("Services saved");
  });

  $("#settings-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target).entries());
    Object.assign(state.settings, d, { avgTicket: Number(d.avgTicket) || s.avgTicket });
    commit(); toast("Profile saved");
  });
  $("#export-data").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "cashs-hair-emporium-data.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });
  $("#import-data").addEventListener("click", () => $("#import-file").click());
  $("#import-file").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    file.text().then((txt) => {
      try {
        const parsed = JSON.parse(txt);
        if (!parsed.contacts || !parsed.settings) throw new Error("not a platform export");
        state = parsed; commit(); route(); toast("Data imported");
      } catch { toast("Import failed — not a valid export file"); }
    });
  });
  $("#clear-data").addEventListener("click", () => {
    if (!confirm("Remove all demo contacts, appointments, campaigns, and reviews? Your profile and services are kept.")) return;
    clearBusinessData(state);
    commit(); route(); toast("Demo data cleared — you're starting fresh");
  });
  $("#reset-data").addEventListener("click", () => {
    if (!confirm("Reset all data back to the demo seed?")) return;
    state = resetState(); route(); toast("Demo data restored");
  });
}

/* ---------------- router ---------------- */

const ROUTES = {
  dashboard: { label: "Dashboard", ico: "◆", fn: viewDashboard },
  contacts: { label: "Contacts", ico: "☰", fn: viewContacts },
  pipeline: { label: "Pipeline", ico: "▤", fn: viewPipeline },
  calendar: { label: "Calendar", ico: "▦", fn: viewCalendar },
  funnels: { label: "Funnels", ico: "▽", fn: viewFunnels },
  marketing: { label: "Marketing", ico: "◎", fn: viewMarketing },
  automations: { label: "Automations", ico: "⚙", fn: viewAutomations },
  reviews: { label: "Reputation", ico: "★", fn: viewReviews },
  settings: { label: "Settings", ico: "≡", fn: viewSettings },
};

function route() {
  state = loadState(); // pick up leads captured by funnel.html in another tab
  const key = (location.hash || "#dashboard").slice(1);
  const view = ROUTES[key] || ROUTES.dashboard;
  document.querySelectorAll(".nav-item").forEach((b) =>
    b.classList.toggle("active", b.dataset.route === key));
  view.fn();
}

function buildNav() {
  const nav = $("#nav");
  nav.innerHTML = Object.entries(ROUTES).map(([key, r]) =>
    `<button class="nav-item" data-route="${key}"><span class="ico">${r.ico}</span>${r.label}</button>`).join("");
  nav.querySelectorAll(".nav-item").forEach((b) =>
    b.addEventListener("click", () => { location.hash = b.dataset.route; }));
}

buildNav();
window.addEventListener("hashchange", route);
window.addEventListener("storage", (e) => { if (e.key === STORE_KEY) route(); });
route();
