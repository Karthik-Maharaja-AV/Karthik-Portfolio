import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);
const preference = matchMedia("(prefers-reduced-motion: reduce)");
let cleanup = () => {};
function setup() {
  cleanup();
  if (preference.matches) return;
  const lenis = new Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false });
  const tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  lenis.on("scroll", ScrollTrigger.update);
  const ctx = gsap.context(() => {
    gsap.from(".hero-copy > *, .floating-card, .scene-signature", {
      y: 22, opacity: 0, duration: 1.1, stagger: .075,
      ease: "power3.out", clearProps: "opacity,transform",
    });
    document.querySelectorAll("#work .heading, #work .explorer, .product-shell, .about, .contact > div, .contact form").forEach((element) => {
      gsap.from(element, {
        y: 30, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 94%", once: true },
        clearProps: "opacity,transform",
      });
    });
  });
  const listeners = [];
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const onClick = (event) => {
      const target = link.hash ? document.querySelector(link.hash) : document.body;
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, {
        offset: -(document.querySelector("nav").offsetHeight + 40),
        onComplete() {
          history.replaceState(null, "", link.hash || location.pathname);
          if (target !== document.body) {
            target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
          }
        },
      });
    };
    link.addEventListener("click", onClick);
    listeners.push(() => link.removeEventListener("click", onClick));
  });
  cleanup = () => {
    listeners.forEach((remove) => remove());
    ctx.revert();
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}
setup();
preference.addEventListener("change", setup);
