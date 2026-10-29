const canvas = document.querySelector("#sculpture"),
  fallback = document.querySelector(".fallback");
const preference = matchMedia("(prefers-reduced-motion: reduce)");
const state = { mode: "salesforce", selected: 0, paused: false, scroll: 0 };
const systems = {
  salesforce: {
    labels: ["CRM", "Automation", "Access", "Data"],
    descriptions: [
      "CRM · Lead, opportunity and quote records begin the journey.",
      "Automation · Apex and Flow connect the steps of a business process.",
      "Access · Permissions control which workflows users can reach.",
      "Data · Consistent records support the downstream invoice.",
    ],
  },
  avs: {
    labels: ["Sales", "Billing", "Inventory", "Payments"],
    descriptions: [
      "Sales · A quotation becomes the starting point for billing.",
      "Billing · Records become invoice line items and a total.",
      "Inventory · Stock movement stays connected to the invoice.",
      "Payments · Collection completes the illustrated journey.",
    ],
  },
};
let scene,
  loading = false,
  failed = false;
const motion = document.querySelector("#motion");
function update() {
  document
    .querySelectorAll("[data-system]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.system === state.mode)),
    );
  document.querySelectorAll("[data-node]").forEach((b, i) => {
    b.textContent = systems[state.mode].labels[i];
    b.setAttribute("aria-pressed", String(i === state.selected));
  });
  document.querySelector("#system-description").textContent =
    systems[state.mode].descriptions[state.selected];
  motion.disabled = preference.matches || failed;
  motion.textContent = motion.disabled ? "—" : state.paused ? "▶" : "Ⅱ";
  motion.setAttribute(
    "aria-label",
    motion.disabled
      ? "Static workflow illustration"
      : state.paused
        ? "Play workflow animation"
        : "Pause workflow animation",
  );
  motion.setAttribute("aria-pressed", String(state.paused));
  scene?.update(state);
}
async function load() {
  if (preference.matches || loading || failed) return;
  if (scene) {
    canvas.hidden = false;
    fallback.hidden = true;
    scene.resume();
    return;
  }
  loading = true;
  try {
    const { createStory } = await import("../scene.js");
    scene = createStory(canvas, state);
    if (preference.matches) {
      scene.suspend();
      return;
    }
    canvas.hidden = false;
    fallback.hidden = true;
    scene.resume();
  } catch {
    failed = true;
    canvas.hidden = true;
    fallback.hidden = false;
  } finally {
    loading = false;
    update();
  }
}
document.querySelectorAll("[data-system]").forEach((b) =>
  b.addEventListener("click", () => {
    state.mode = b.dataset.system;
    state.selected = 0;
    update();
  }),
);
document.querySelectorAll("[data-node]").forEach((b) =>
  b.addEventListener("click", () => {
    state.selected = Number(b.dataset.node);
    update();
  }),
);
motion.addEventListener("click", () => {
  state.paused = !state.paused;
  update();
});
addEventListener("hero-progress", (e) => {
  state.scroll = e.detail;
  scene?.update(state);
});
preference.addEventListener("change", () => {
  if (preference.matches) {
    scene?.suspend();
    canvas.hidden = true;
    fallback.hidden = false;
  } else {
    load();
  }
  update();
});
update();
new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting)
      requestAnimationFrame(() => requestAnimationFrame(load));
  },
  { rootMargin: "50px" },
).observe(document.querySelector(".hero"));
