// Runs before first paint (classic script, CSP-safe) so the saved theme never flashes.
(function () {
  const root = document.documentElement;
  const system = matchMedia("(prefers-color-scheme: dark)");
  let saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch (e) {}
  const apply = (theme) => {
    root.dataset.theme = theme;
    const toggle = document.querySelector(".theme-toggle");
    if (toggle)
      toggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
      );
  };
  apply(saved || (system.matches ? "dark" : "light"));
  system.addEventListener("change", (e) => {
    if (!saved) apply(e.matches ? "dark" : "light");
  });
  document.addEventListener("DOMContentLoaded", () => {
    apply(root.dataset.theme);
    document.querySelector(".theme-toggle").addEventListener("click", () => {
      saved = root.dataset.theme === "dark" ? "light" : "dark";
      root.classList.add("theme-switching");
      setTimeout(() => root.classList.remove("theme-switching"), 500);
      try {
        localStorage.setItem("theme", saved);
      } catch (e) {}
      apply(saved);
    });
  });
})();
