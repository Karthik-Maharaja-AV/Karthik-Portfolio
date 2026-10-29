const fonts = document.querySelector("[data-fonts]");
fonts.addEventListener("load", () => (fonts.media = "all"));
if (fonts.sheet) fonts.media = "all";
