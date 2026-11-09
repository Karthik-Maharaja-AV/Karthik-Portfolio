// One pointer listener; artwork moves without moving the reading surface.
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const fine = matchMedia("(hover: hover) and (pointer: fine)");
const scene = document.querySelector(".liquid-scene");
const surfaces = [...document.querySelectorAll(".floating-card, .detail, .product-shell")];
let frame = 0;
function update(event) {
  if (reduce.matches || !fine.matches || frame) return;
  const x = event.clientX, y = event.clientY;
  frame = requestAnimationFrame(() => {
    frame = 0;
    for (const surface of surfaces) {
      const bounds = surface.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > innerHeight) continue;
      surface.style.setProperty("--light-x", `${x - bounds.left}px`);
      surface.style.setProperty("--light-y", `${y - bounds.top}px`);
    }
    const bounds = scene.getBoundingClientRect();
    if (bounds.bottom > 0 && bounds.top < innerHeight) {
      scene.style.setProperty("--scene-x", `${(x / innerWidth - .5) * 16}px`);
      scene.style.setProperty("--scene-y", `${(y / innerHeight - .5) * 12}px`);
    }
  });
}
document.addEventListener("pointermove", update, { passive: true });
document.documentElement.addEventListener("pointerleave", () => {
  scene.style.setProperty("--scene-x", "0px");
  scene.style.setProperty("--scene-y", "0px");
});
