import "./src/story.js";
import { cases, products, profile } from "./src/data.js";
const workList = document.querySelector("#work-list"),
  workDetail = document.querySelector("#work-detail");
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
let activeWork = 0,
  workView = "overview";
const views = {
  overview: "Overview",
  changes: "Changes",
  approach: "Approach",
};
cases.forEach((p, i) => {
  const b = document.createElement("button");
  b.className = "work-select";
  b.innerHTML = `<span class="num">${p.number}</span><span><strong>${p.label}</strong><small>${p.tags.slice(0, 2).join(" / ")}</small></span><span class="arrow" aria-hidden="true">↗</span>`;
  b.setAttribute("aria-controls", "work-detail");
  b.onclick = () => selectWork(i);
  workList.append(b);
});
// One highlight glides between rows: it follows hover and rests on the active case.
const workRows = workList.querySelectorAll(".work-select"),
  indicator = document.createElement("span");
indicator.className = "work-indicator";
indicator.setAttribute("aria-hidden", "true");
workList.prepend(indicator);
function moveIndicator(row) {
  indicator.style.transform = `translate(${row.offsetLeft}px, ${row.offsetTop}px)`;
  indicator.style.width = row.offsetWidth + "px";
  indicator.style.height = row.offsetHeight + "px";
}
// Constellation nodes mirror the list: the active case glows, the hovered one lights up.
const nodes = document.querySelectorAll(".work-art .node"),
  bot = document.querySelector(".bolt-bot");
function lightNodes(hot = -1) {
  nodes.forEach((n) => {
    n.classList.toggle("is-on", Number(n.dataset.case) === activeWork);
    n.classList.toggle("is-hot", Number(n.dataset.case) === hot);
  });
}
nodes.forEach((n) => {
  n.addEventListener("pointerenter", () => lightNodes(Number(n.dataset.case)));
  n.addEventListener("pointerleave", () => lightNodes());
  n.addEventListener("click", () => selectWork(Number(n.dataset.case)));
});
workRows.forEach((row, i) =>
  row.addEventListener("pointerenter", () => {
    moveIndicator(row);
    lightNodes(i);
  }),
);
workList.addEventListener("pointerleave", () => {
  moveIndicator(workRows[activeWork]);
  lightNodes();
});
new ResizeObserver(() => moveIndicator(workRows[activeWork])).observe(workList);
function selectWork(i, direction = Math.sign(i - activeWork)) {
  activeWork = (i + cases.length) % cases.length;
  const p = cases[activeWork];
  workRows.forEach((b, j) =>
    b.setAttribute("aria-pressed", String(j === activeWork)),
  );
  moveIndicator(workRows[activeWork]);
  requestAnimationFrame(() => indicator.classList.add("is-ready"));
  lightNodes();
  if (direction) {
    bot.classList.remove("hop");
    void bot.offsetWidth;
    bot.classList.add("hop");
  }
  workDetail.classList.remove("case-step", "view-step");
  void workDetail.offsetWidth;
  workDetail.style.setProperty("--dir", direction || 1);
  workDetail.classList.add(direction ? "case-step" : "view-step");
  const content =
    workView === "overview"
      ? `<div class="case-outcome impact"><span>IMPACT</span><p>${escape(p.impact)}</p></div><p>${escape(p.description)}</p>`
      : workView === "changes"
        ? `<div class="case-outcome"><span>MY CONTRIBUTION</span><p>${escape(p.contribution)}</p></div><div class="case-tech">${p.tags.map((t, j) => `<div><span>0${j + 1}</span><strong>${escape(t)}</strong></div>`).join("")}</div>`
        : `<div class="case-outcome"><span>APPROACH</span><ol class="approach-steps">${p.approach.map((s) => `<li>${escape(s)}</li>`).join("")}</ol></div>`;
  workDetail.innerHTML = `<div class="case-top"><span>SALESFORCE / CASE ${p.number}</span><span class="case-counter">${p.number} <i>/ 06</i></span></div><h3>${p.title}</h3><div class="case-tabs" role="group" aria-label="Case study view">${Object.entries(
    views,
  )
    .map(
      ([key, label]) =>
        `<button data-case-view="${key}" aria-pressed="${workView === key}">${label}</button>`,
    )
    .join(
      "",
    )}</div><div class="case-content swap-in">${content}</div><div class="case-bottom"><div class="case-dots" role="img" aria-label="Case ${activeWork + 1} of 6">${cases.map((_, j) => `<span class="${j === activeWork ? "current" : ""}"></span>`).join("")}</div><div class="case-nav"><button data-case-step="-1" aria-label="Previous Salesforce case">←</button><button data-case-step="1" aria-label="Next Salesforce case">→</button></div></div>`;
  workDetail.querySelectorAll("[data-case-view]").forEach(
    (b) =>
      (b.onclick = () => {
        workView = b.dataset.caseView;
        selectWork(activeWork, 0);
        workDetail
          .querySelector(`[data-case-view="${workView}"]`)
          .focus({ preventScroll: true });
      }),
  );
  workDetail.querySelectorAll("[data-case-step]").forEach(
    (b) =>
      (b.onclick = () => {
        const step = b.dataset.caseStep;
        selectWork(activeWork + Number(step), Number(step));
        workDetail
          .querySelector(`[data-case-step="${step}"]`)
          .focus({ preventScroll: true });
      }),
  );
}
workList.addEventListener("keydown", (e) => {
  if (["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(e.key)) {
    e.preventDefault();
    const step = ["ArrowDown", "ArrowRight"].includes(e.key) ? 1 : -1;
    selectWork(activeWork + step, step);
    workRows[activeWork].focus();
  }
});
const moduleNav = document.querySelector("#module-nav"),
  modulePanel = document.querySelector("#module-panel");
products.forEach((m, i) => {
  const b = document.createElement("button");
  b.textContent = m.label;
  b.setAttribute("aria-controls", "module-panel");
  b.onclick = () => selectModule(i);
  moduleNav.append(b);
});
// A pill glides to the chosen module, in the vertical list or the mobile scroller.
const moduleButtons = moduleNav.querySelectorAll("button"),
  modulePill = document.createElement("span");
let activeModule = 0;
modulePill.className = "module-pill";
modulePill.setAttribute("aria-hidden", "true");
moduleNav.prepend(modulePill);
function movePill() {
  const b = moduleButtons[activeModule];
  modulePill.style.transform = `translate(${b.offsetLeft}px, ${b.offsetTop}px)`;
  modulePill.style.width = b.offsetWidth + "px";
  modulePill.style.height = b.offsetHeight + "px";
}
new ResizeObserver(movePill).observe(moduleNav);
// Journey track: a receipt rides station to station; money journeys end in a coin.
const rider = `<svg viewBox="0 0 40 44"><path class="chit-body" d="M6 2H34V36L30 32L26 36L22 32L18 36L14 32L10 36L6 32Z"/><path class="chit-line" d="M11 8H29M11 13H23"/><circle class="chit-eye" cx="15" cy="20" r="1.9"/><circle class="chit-eye" cx="25" cy="20" r="1.9"/><path class="chit-line" d="M17 25Q20 28 23 25"/><circle class="chit-blush" cx="11" cy="24" r="2"/><circle class="chit-blush" cx="29" cy="24" r="2"/><circle class="chit-wheel" cx="12" cy="40" r="3"/><circle class="chit-wheel" cx="28" cy="40" r="3"/></svg>`,
  coin = `<svg viewBox="0 0 30 30"><circle class="coin-face" cx="15" cy="15" r="13"/><text x="15" y="20.5">₹</text><path class="coin-shine" d="M8 9Q10 6 13 5.5"/></svg>`,
  check = `<svg viewBox="0 0 30 30"><circle class="check-face" cx="15" cy="15" r="13"/><path class="check-mark" d="M9 15.5L13.5 20L21.5 10.5"/></svg>`,
  moneySteps = ["Invoice", "Payment", "Collection"];
function selectModule(i) {
  activeModule = i;
  const m = products[i];
  moduleButtons.forEach((b, j) =>
    b.setAttribute("aria-pressed", String(i === j)),
  );
  movePill();
  requestAnimationFrame(() => modulePill.classList.add("is-ready"));
  modulePanel.classList.remove("swap-in");
  void modulePanel.offsetWidth;
  modulePanel.classList.add("swap-in");
  modulePanel.innerHTML = `<h3>${m.title}</h3><p>${m.description}</p><div class="journey-track"><div class="rail" aria-hidden="true"><i></i></div><div class="rider" aria-hidden="true">${rider}</div><div class="goal" aria-hidden="true">${moneySteps.includes(m.steps.at(-1)) ? coin : check}</div><ol class="stations" aria-label="Journey">${m.steps.map((s) => `<li class="station"><span class="dot"></span>${s}</li>`).join("")}</ol></div><div class="contribution"><strong>CONTRIBUTION & SCOPE</strong><p>${m.contribution}</p></div>`;
}
selectWork(0, 0);
selectModule(0);
for (const [key, label] of Object.entries({
  email: "Email",
  linkedin: "LinkedIn",
  trailhead: "Trailhead",
  resume: "Résumé PDF",
  tracker: "Salesforce learning tracker",
})) {
  const el = document.querySelector(`[data-profile="${key}"]`);
  if (profile[key]) {
    const a = document.createElement("a");
    a.className = el.className;
    a.textContent = label;
    a.href = key === "email" ? "mailto:" + profile[key] : profile[key];
    if (key !== "email") {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    el.replaceWith(a);
  }
}
// Flashlight follows fine pointers only; touch devices never see the dot grid.
if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
  const spot = document.querySelector(".spotlight"),
    pupils = document.querySelectorAll(".bolt-bot .pupil");
  let px = 0,
    py = 0,
    pending = false;
  addEventListener(
    "pointermove",
    (e) => {
      px = e.clientX;
      py = e.clientY;
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        spot.style.setProperty("--x", px + "px");
        spot.style.setProperty("--y", py + "px");
        spot.classList.add("is-on");
        // The robot's eyes follow the pointer, a few pixels at most.
        pupils.forEach((p) => {
          const r = p.getBoundingClientRect(),
            dx = px - (r.left + r.width / 2),
            dy = py - (r.top + r.height / 2),
            reach = Math.min(2.6, Math.hypot(dx, dy) / 60),
            angle = Math.atan2(dy, dx);
          p.setAttribute(
            "transform",
            `translate(${Math.cos(angle) * reach} ${Math.sin(angle) * reach})`,
          );
        });
        pending = false;
      });
    },
    { passive: true },
  );
  document.documentElement.addEventListener("pointerleave", () =>
    spot.classList.remove("is-on"),
  );
}
// Lightweight navigation state remains available without animation libraries.
let queued = false;
const progress = () => {
  if (scrollY < 200)
    document
      .querySelectorAll("nav .links a")
      .forEach((a) => a.classList.remove("is-current"));
  const max = document.documentElement.scrollHeight - innerHeight;
  document.querySelector(".scroll-progress").style.transform =
    `scaleX(${max > 0 ? scrollY / max : 0})`;
  queued = false;
};
addEventListener(
  "scroll",
  () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(progress);
    }
  },
  { passive: true },
);
progress();
const sectionObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting)
        document
          .querySelectorAll("nav .links a")
          .forEach((a) =>
            a.classList.toggle("is-current", a.hash === "#" + e.target.id),
          );
    }),
  { rootMargin: "-15% 0px -55% 0px" },
);
document
  .querySelectorAll("#work,#avs,#about,#contact")
  .forEach((s) => sectionObserver.observe(s));
requestAnimationFrame(() =>
  requestAnimationFrame(() => import("./src/motion.js").catch(() => {})),
);

import "./src/contact.js";
