/* Minimal SVG chart builders. No dependencies.
   Colors come from CSS custom properties defined in css/app.css:
   series slots --series-1..6 (validated categorical palette), the gold
   ordinal ramp --ramp-1..5, and chart chrome tokens. */

const SVG_NS = "http://www.w3.org/2000/svg";

function el(tag, attrs = {}, parent) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (parent) parent.appendChild(node);
  return node;
}

function fmtMoney(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function chartTooltip(host) {
  let tip = host.querySelector(".chart-tip");
  if (!tip) {
    tip = document.createElement("div");
    tip.className = "chart-tip";
    tip.setAttribute("role", "status");
    host.appendChild(tip);
  }
  return {
    show(x, y, html) {
      tip.innerHTML = html;
      tip.style.display = "block";
      const hostRect = host.getBoundingClientRect();
      const w = tip.offsetWidth;
      let left = x + 12;
      if (left + w > hostRect.width - 8) left = x - w - 12;
      tip.style.left = Math.max(4, left) + "px";
      tip.style.top = Math.max(4, y - 10) + "px";
    },
    hide() { tip.style.display = "none"; },
  };
}

/* Single-series line chart with area wash, crosshair and tooltip. */
export function lineChart(host, points, { money = true } = {}) {
  host.innerHTML = "";
  host.classList.add("chart-host");
  const W = 640, H = 220, pad = { t: 16, r: 16, b: 28, l: 46 };
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, class: "chart", role: "img",
    "aria-label": "Line chart: " + points.map((p) => `${p.label} ${p.value}`).join(", ") });
  host.appendChild(svg);

  const max = Math.max(0, ...points.map((p) => p.value)) * 1.15 || 1;
  const x = (i) => pad.l + (i * (W - pad.l - pad.r)) / (points.length - 1);
  const y = (v) => H - pad.b - (v / max) * (H - pad.t - pad.b);

  // gridlines + y ticks
  for (let g = 0; g <= 3; g++) {
    const v = (max / 3) * g;
    el("line", { x1: pad.l, x2: W - pad.r, y1: y(v), y2: y(v), class: "grid" }, svg);
    const t = el("text", { x: pad.l - 8, y: y(v) + 4, class: "tick", "text-anchor": "end" }, svg);
    t.textContent = money ? "$" + (v >= 1000 ? (v / 1000).toFixed(1) + "k" : Math.round(v)) : Math.round(v);
  }
  points.forEach((p, i) => {
    const t = el("text", { x: x(i), y: H - 8, class: "tick", "text-anchor": "middle" }, svg);
    t.textContent = p.label;
  });

  const lineD = points.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.value)}`).join(" ");
  const areaD = `${lineD} L${x(points.length - 1)},${H - pad.b} L${x(0)},${H - pad.b} Z`;
  el("path", { d: areaD, class: "line-area" }, svg);
  el("path", { d: lineD, class: "line-stroke" }, svg);

  const cross = el("line", { y1: pad.t, y2: H - pad.b, class: "crosshair", style: "display:none" }, svg);
  const dot = el("circle", { r: 5, class: "line-dot", style: "display:none" }, svg);
  const tip = chartTooltip(host);

  svg.addEventListener("mousemove", (ev) => {
    const rect = svg.getBoundingClientRect();
    const mx = ((ev.clientX - rect.left) / rect.width) * W;
    const i = Math.max(0, Math.min(points.length - 1,
      Math.round(((mx - pad.l) / (W - pad.l - pad.r)) * (points.length - 1))));
    const p = points[i];
    cross.setAttribute("x1", x(i)); cross.setAttribute("x2", x(i));
    cross.style.display = "block";
    dot.setAttribute("cx", x(i)); dot.setAttribute("cy", y(p.value));
    dot.style.display = "block";
    tip.show((x(i) / W) * rect.width, (y(p.value) / H) * rect.height,
      `<strong>${p.label}</strong> · ${money ? fmtMoney(p.value) : p.value}`);
  });
  svg.addEventListener("mouseleave", () => {
    cross.style.display = "none"; dot.style.display = "none"; tip.hide();
  });
}

/* Horizontal bars, one categorical color per row, direct labels. */
export function hBarChart(host, rows, { money = false } = {}) {
  host.innerHTML = "";
  host.classList.add("chart-host");
  if (!rows.length) { host.innerHTML = `<div class="empty">No data yet</div>`; return; }
  const max = Math.max(0, ...rows.map((r) => r.value)) || 1;
  const wrap = document.createElement("div");
  wrap.className = "hbars";
  rows.forEach((r, i) => {
    const row = document.createElement("div");
    row.className = "hbar-row";
    row.innerHTML = `
      <span class="hbar-name">${r.label}</span>
      <span class="hbar-track"><span class="hbar-fill" style="width:${(r.value / max) * 100}%;
        background:var(--series-${(i % 6) + 1})"></span></span>
      <span class="hbar-val">${money ? fmtMoney(r.value) : r.value}</span>`;
    row.title = `${r.label}: ${money ? fmtMoney(r.value) : r.value}`;
    wrap.appendChild(row);
  });
  host.appendChild(wrap);
}

/* Grouped vertical bars (e.g. spend vs revenue per campaign), one $ axis. */
export function groupedBarChart(host, groups, seriesNames) {
  host.innerHTML = "";
  host.classList.add("chart-host");
  if (!groups.length) { host.innerHTML = `<div class="empty">No campaigns yet</div>`; return; }
  const W = 640, H = 240, pad = { t: 14, r: 16, b: 42, l: 50 };
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, class: "chart", role: "img",
    "aria-label": "Grouped bar chart of " + seriesNames.join(" and ") });
  host.appendChild(svg);
  const max = Math.max(0, ...groups.flatMap((g) => g.values)) * 1.15 || 1;
  const y = (v) => H - pad.b - (v / max) * (H - pad.t - pad.b);
  for (let g = 0; g <= 3; g++) {
    const v = (max / 3) * g;
    el("line", { x1: pad.l, x2: W - pad.r, y1: y(v), y2: y(v), class: "grid" }, svg);
    const t = el("text", { x: pad.l - 8, y: y(v) + 4, class: "tick", "text-anchor": "end" }, svg);
    t.textContent = "$" + (v >= 1000 ? (v / 1000).toFixed(1) + "k" : Math.round(v));
  }
  const tip = chartTooltip(host);
  const groupW = (W - pad.l - pad.r) / groups.length;
  const barW = Math.min(26, (groupW - 16) / seriesNames.length);
  groups.forEach((g, gi) => {
    const cx = pad.l + groupW * gi + groupW / 2;
    g.values.forEach((v, si) => {
      const bx = cx - (barW * seriesNames.length + 2 * (seriesNames.length - 1)) / 2 + si * (barW + 2);
      const rect = el("rect", {
        x: bx, y: y(v), width: barW, height: H - pad.b - y(v), rx: 4,
        class: "bar", style: `fill:var(--series-${si + 1})`,
      }, svg);
      rect.addEventListener("mousemove", (ev) => {
        const r = svg.getBoundingClientRect();
        tip.show(ev.clientX - r.left, ev.clientY - r.top,
          `<strong>${g.label}</strong> · ${seriesNames[si]}: ${fmtMoney(v)}`);
      });
      rect.addEventListener("mouseleave", () => tip.hide());
    });
    const t = el("text", { x: cx, y: H - 22, class: "tick", "text-anchor": "middle" }, svg);
    // wrap long campaign names to two short lines
    const words = g.label.split(" ");
    const line1 = words.slice(0, 2).join(" ");
    const line2 = words.slice(2).join(" ");
    t.textContent = line1;
    if (line2) {
      const t2 = el("text", { x: cx, y: H - 8, class: "tick", "text-anchor": "middle" }, svg);
      t2.textContent = line2.length > 14 ? line2.slice(0, 13) + "…" : line2;
    }
  });
  el("line", { x1: pad.l, x2: W - pad.r, y1: H - pad.b, y2: H - pad.b, class: "baseline" }, svg);

  const legend = document.createElement("div");
  legend.className = "chart-legend";
  legend.innerHTML = seriesNames.map((n, i) =>
    `<span class="legend-item"><span class="legend-swatch" style="background:var(--series-${i + 1})"></span>${n}</span>`).join("");
  host.appendChild(legend);
}

/* Funnel: ordinal gold ramp, centered bars, conversion % between steps. */
export function funnelChart(host, steps) {
  host.innerHTML = "";
  host.classList.add("chart-host");
  const max = steps[0].count || 1;
  const wrap = document.createElement("div");
  wrap.className = "funnel-steps";
  steps.forEach((s, i) => {
    const pctOfTop = Math.round((s.count / max) * 100);
    const conv = i === 0 ? null : (steps[i - 1].count ? Math.round((s.count / steps[i - 1].count) * 100) : 0);
    const row = document.createElement("div");
    row.className = "funnel-step";
    row.innerHTML = `
      <div class="funnel-meta"><span>${s.name}</span><span class="funnel-count">${s.count.toLocaleString("en-US")}</span></div>
      <div class="funnel-bar-track">
        <div class="funnel-bar" style="width:${Math.max(pctOfTop, 6)}%;background:var(--ramp-${Math.min(i + 1, 5)})"></div>
      </div>
      ${conv !== null ? `<div class="funnel-conv">↓ ${conv}% converted</div>` : ""}`;
    wrap.appendChild(row);
  });
  host.appendChild(wrap);
}
