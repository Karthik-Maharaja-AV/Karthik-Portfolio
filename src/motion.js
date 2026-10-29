import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { cases } from "./data.js";
gsap.registerPlugin(ScrollTrigger);
const preference = matchMedia("(prefers-reduced-motion: reduce)");
// Land sections just below the sticky header.
const headerOffset = () => -(document.querySelector("nav").offsetHeight + 16);
const icons = {
  apex: '<svg viewBox="0 0 24 24"><path d="M9 4C6 4 6 6 6 9s-2 3-2 3 2 0 2 3 0 5 3 5M15 4c3 0 3 2 3 5s2 3 2 3-2 0-2 3 0 5-3 5"/></svg>',
  experience:
    '<svg viewBox="0 0 24 24"><circle cx="5" cy="6" r="2.5"/><circle cx="19" cy="12" r="2.5"/><circle cx="5" cy="18" r="2.5"/><path d="M7.5 6H12q2 0 2 2v2q0 2 2.5 2M7.5 18H12q2 0 2-2v-2"/></svg>',
  security:
    '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><circle cx="12" cy="16" r="1.4"/></svg>',
  data: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5.5" rx="7" ry="2.5"/><path d="M5 5.5v13c0 2 14 2 14 0v-13M5 12c0 2 14 2 14 0"/></svg>',
};
const tones = [
  "#24332c",
  "#3d5443",
  "#6b4f3a",
  "#2f4148",
  "#57724d",
  "#7a3b22",
];
// Wrap each word and character so the hero headline can animate per letter.
function splitChars(el) {
  if (el.querySelector(".char")) return;
  el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
  const walk = (node) =>
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.append(" ");
          const word = document.createElement("span");
          word.className = "word";
          word.setAttribute("aria-hidden", "true");
          [...part].forEach((c) => {
            const char = document.createElement("span");
            char.className = "char";
            char.textContent = c;
            word.append(char);
          });
          frag.append(word);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === Node.ELEMENT_NODE && n.tagName !== "BR")
        walk(n);
    });
  walk(el);
}
let cleanup = () => {};
function setup() {
  cleanup();
  if (preference.matches) return;
  const lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    syncTouch: false,
  });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (t) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  const listeners = [];
  const on = (el, event, fn) => {
    el.addEventListener(event, fn);
    listeners.push(() => el.removeEventListener(event, fn));
  };
  const ctx = gsap.context(() => {
    const panel = document.querySelector(".page-transition"),
      panelLabel = panel.querySelector(".pt-label"),
      [panelTop, panelBottom] = panel.querySelectorAll("path"),
      curve = {
        topBulge: "M0 100 Q50 0 100 100 Z",
        topFlat: "M0 100 Q50 100 100 100 Z",
        bottomFlat: "M0 0 Q50 0 100 0 Z",
        bottomBulge: "M0 0 Q50 100 100 0 Z",
      };
    let transitioning = false;
    const land = (target, hash) => {
      history.replaceState(null, "", hash || location.pathname);
      if (target !== document.body) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    };
    // Nav, logo and footer links travel with the wipe; in-content links glide.
    function wipeTo(target, hash, label) {
      transitioning = true;
      lenis.stop();
      panelLabel.textContent = label;
      panel.hidden = false;
      gsap
        .timeline({
          onComplete: () => {
            panel.hidden = true;
            transitioning = false;
          },
        })
        .set(panel, { yPercent: 115 })
        .set(panelTop, { attr: { d: curve.topBulge } })
        .set(panelBottom, { attr: { d: curve.bottomFlat } })
        .set(panelLabel, { opacity: 0, y: 40 })
        .to(panel, { yPercent: 0, duration: 0.8, ease: "power4.inOut" })
        .to(
          panelTop,
          { attr: { d: curve.topFlat }, duration: 0.8, ease: "power4.inOut" },
          "<",
        )
        .to(".wrap", { y: -90, duration: 0.8, ease: "power4.inOut" }, "<")
        .to(
          panelLabel,
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
          "-=0.35",
        )
        .add(() => {
          lenis.start();
          gsap.set(".wrap", { y: 0 });
          lenis.scrollTo(target, {
            offset: headerOffset(),
            immediate: true,
            force: true,
          });
          ScrollTrigger.update();
          gsap.set(".wrap", { y: 90 });
          land(target, hash);
        })
        .to(
          panelLabel,
          { opacity: 0, y: -40, duration: 0.4, ease: "power2.in" },
          "+=0.3",
        )
        .to(
          panel,
          { yPercent: -115, duration: 0.85, ease: "power4.inOut" },
          "-=0.15",
        )
        .to(
          panelBottom,
          {
            attr: { d: curve.bottomBulge },
            duration: 0.85,
            ease: "power4.inOut",
          },
          "<",
        )
        .to(
          ".wrap",
          {
            y: 0,
            duration: 0.85,
            ease: "power4.inOut",
            clearProps: "transform",
          },
          "<",
        );
    }
    document.querySelectorAll('a[href^="#"]').forEach((a) =>
      on(a, "click", (e) => {
        const target = a.hash ? document.querySelector(a.hash) : document.body;
        if (!target) return;
        e.preventDefault();
        if (transitioning) return;
        if (a.closest("nav, footer"))
          return wipeTo(
            target,
            a.hash,
            a.hash ? a.textContent.replace(/[↑↓↗]/g, "").trim() : "Home",
          );
        lenis.scrollTo(target, {
          offset: headerOffset(),
          onComplete: () => land(target, a.hash),
        });
      }),
    );
    let intro = true;
    try {
      intro = !sessionStorage.getItem("portfolio-intro");
      sessionStorage.setItem("portfolio-intro", "seen");
    } catch {}
    const curtain = document.querySelector(".intro-curtain");
    if (intro && !location.hash) {
      curtain.hidden = false;
      gsap.set(curtain, { yPercent: 0 });
      const greeting = curtain.querySelector(".greeting"),
        path = curtain.querySelector("path");
      const tl = gsap.timeline({ onComplete: () => (curtain.hidden = true) });
      ["Hello", "Vanakkam", "Namaste", "karthik."].forEach((word, i) =>
        tl.call(() => (greeting.textContent = word), [], i * 0.2),
      );
      tl.to(
        curtain,
        { yPercent: -115, duration: 0.85, ease: "power3.inOut" },
        0.8,
      ).to(
        path,
        {
          attr: { d: "M0 0 H100 V0 Q50 0 0 0 Z" },
          duration: 0.85,
          ease: "power2.inOut",
        },
        0.8,
      );
      gsap.from(".scene", {
        opacity: 0,
        y: 25,
        duration: 0.85,
        delay: 0.7,
        clearProps: "opacity,transform",
      });
    } else curtain.hidden = true;
    document
      .querySelectorAll(".heading h2,.about h2,.contact h2,.product-title h2")
      .forEach((el) => {
        if (!el.querySelector(".line-mask")) {
          const parts = el.innerHTML.split(/<br\s*\/?>/i);
          el.innerHTML = parts
            .map(
              (line) =>
                `<span class="line-mask"><span class="line-inner">${line}</span></span>`,
            )
            .join("");
        }
        gsap.from(el.querySelectorAll(".line-inner"), {
          yPercent: 110,
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 95%", once: true },
          clearProps: "transform,opacity",
        });
      });
    // Hero: letters flip up out of a blur, then the italic phrase drops in with a bounce.
    const h1 = document.querySelector("h1");
    splitChars(h1);
    gsap
      .timeline({ delay: intro && !location.hash ? 0.95 : 0.15 })
      .from(h1.querySelectorAll(":scope > .word .char"), {
        yPercent: 110,
        rotateX: -90,
        opacity: 0,
        filter: "blur(8px)",
        transformOrigin: "50% 100%",
        duration: 1,
        stagger: 0.035,
        ease: "expo.out",
        clearProps: "all",
      })
      .from(
        h1.querySelectorAll("em .char"),
        {
          y: -60,
          rotate: gsap.utils.wrap([-24, 18, -12, 22]),
          scale: 0.4,
          opacity: 0,
          duration: 0.9,
          stagger: 0.05,
          ease: "back.out(2.4)",
          clearProps: "all",
        },
        "-=0.6",
      )
      .from(
        ".hero .eyebrow,.hero-copy > p,.hero .actions > *,.hero-foot > *",
        {
          y: 22,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform,opacity",
        },
        "-=0.7",
      );
    if (matchMedia("(hover:hover) and (pointer:fine)").matches)
      h1.querySelectorAll(".char").forEach((c) =>
        on(c, "pointerenter", () => {
          if (gsap.isTweening(c)) return;
          gsap.to(c, {
            yPercent: -18,
            duration: 0.18,
            yoyo: true,
            repeat: 1,
            ease: "power2.out",
          });
        }),
      );
    gsap.utils
      .toArray(
        ".section .eyebrow,.product-shell > .eyebrow,.about .eyebrow,.contact .eyebrow",
      )
      .forEach((el) =>
        gsap.from(el, {
          letterSpacing: "0.6em",
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 95%", once: true },
          clearProps: "letter-spacing,opacity",
        }),
      );
    gsap.from(".detail", {
      clipPath: "inset(100% 0% 0% 0% round 7px)",
      duration: 1.1,
      ease: "power4.inOut",
      scrollTrigger: { trigger: ".detail", start: "top 85%", once: true },
      clearProps: "clip-path",
    });
    [
      ".module-nav button",
      ".learning span",
      ".contact-links > *",
      ".contact form label,.contact form .button",
      "footer > *",
    ].forEach((selector) =>
      gsap.from(selector, {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: "power3.out",
        // "top bottom": items at the very end of the page must still be able to trigger.
        scrollTrigger: {
          trigger: document.querySelector(selector),
          start: "top bottom",
          once: true,
        },
        clearProps: "transform,opacity",
      }),
    );
    gsap.from(".module-panel,.product-note", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".product-explorer",
        start: "top 88%",
        once: true,
      },
      clearProps: "transform,opacity",
    });
    // Doodles draw themselves in; nodes pop; the characters arrive last.
    const drawn = document.querySelectorAll(
      ".squiggle path,.cloud-outline,.constellation .links path",
    );
    drawn.forEach((p) => {
      const length = p.getTotalLength();
      gsap.set(p, { strokeDasharray: length, strokeDashoffset: length });
    });
    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#work .heading",
          start: "top 80%",
          once: true,
        },
        onComplete: () =>
          gsap.set(".constellation .links path", {
            clearProps: "strokeDasharray,strokeDashoffset",
          }),
      })
      .to(".squiggle path", {
        strokeDashoffset: 0,
        duration: 0.9,
        ease: "power2.inOut",
      })
      .from(".cloud-outline", { fillOpacity: 0, duration: 0.01 }, 0)
      .to(
        ".cloud-outline",
        { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" },
        0.1,
      )
      .to(".cloud-outline", { fillOpacity: 0.55, duration: 0.6 }, 1.1)
      .to(
        ".constellation .links path",
        { strokeDashoffset: 0, duration: 0.45, stagger: 0.07 },
        0.9,
      )
      .from(
        ".work-art .node",
        {
          scale: 0,
          transformOrigin: "50% 50%",
          duration: 0.45,
          stagger: 0.08,
          ease: "back.out(3)",
        },
        1.1,
      )
      .from(
        ".cirrus",
        { y: 30, opacity: 0, duration: 0.7, ease: "back.out(2)" },
        1.6,
      )
      .from(".sparkle", { opacity: 0, duration: 0.4, stagger: 0.1 }, 1.8)
      .from(".doodle-note", { opacity: 0, y: 12, duration: 0.5 }, 2);
    // avs-corp: the capability band drifts with scroll on top of its own loop.
    gsap.fromTo(
      ".marquee-inner",
      { x: 160 },
      {
        x: -160,
        ease: "none",
        scrollTrigger: {
          trigger: ".avs-marquee",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      },
    );
    const noteArrow = document.querySelector(".avs-note path");
    gsap.set(noteArrow, {
      strokeDasharray: noteArrow.getTotalLength(),
      strokeDashoffset: noteArrow.getTotalLength(),
    });
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".product-title",
          start: "top 80%",
          once: true,
        },
      })
      .from(
        ".avs-note",
        {
          opacity: 0,
          y: 14,
          rotation: -12,
          duration: 0.6,
          ease: "back.out(2)",
        },
        0.5,
      )
      .to(
        noteArrow,
        { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" },
        0.9,
      );
    gsap.from(".bot-peek", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(2)",
      scrollTrigger: {
        trigger: "#work .explorer",
        start: "top 75%",
        once: true,
      },
      clearProps: "transform,opacity",
    });
    gsap.utils.toArray(".heading h2,.about h2").forEach((el) =>
      gsap.fromTo(
        el,
        { xPercent: -3 },
        {
          xPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        },
      ),
    );
    gsap.utils
      .toArray(
        ".heading p,.about p,.work-select,.product-title p,.product-link",
      )
      .forEach((el) =>
        gsap.from(el, {
          y: 18,
          opacity: 0,
          duration: 0.65,
          scrollTrigger: { trigger: el, start: "top 96%", once: true },
          clearProps: "transform,opacity",
        }),
      );
    gsap.fromTo(
      ".product-shell",
      { scale: 0.95 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".product-shell",
          start: "top bottom",
          end: "top 20%",
          scrub: 0.6,
        },
      },
    );
    gsap.fromTo(
      ".contact-curve",
      { scaleY: 1 },
      {
        scaleY: 0.02,
        ease: "none",
        scrollTrigger: {
          trigger: ".contact",
          start: "top bottom",
          end: "top 25%",
          scrub: 0.6,
        },
      },
    );
    gsap.to(".hero-copy", {
      y: 55,
      opacity: 0.6,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(".scene", {
      y: 20,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      onUpdate: (self) =>
        dispatchEvent(
          new CustomEvent("hero-progress", { detail: self.progress }),
        ),
    });
    if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
      document.querySelectorAll(".button,nav .links a").forEach((el) => {
        const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" }),
          y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
        let r;
        on(el, "pointerenter", () => (r = el.getBoundingClientRect()));
        on(el, "pointermove", (e) => {
          if (!r) return;
          x((e.clientX - r.left - r.width / 2) * 0.13);
          y((e.clientY - r.top - r.height / 2) * 0.18);
        });
        on(el, "pointerleave", () => {
          x(0);
          y(0);
        });
      });
      // Case card trails the pointer, leans with its speed, and slides between cases.
      const list = document.querySelector("#work-list"),
        peek = document.createElement("div");
      peek.className = "work-peek";
      peek.setAttribute("aria-hidden", "true");
      peek.innerHTML = `<div class="peek-track">${cases
        .map(
          (c, i) =>
            `<div class="peek-slide" style="--tone:${tones[i]}">${icons[c.category]}<span>CASE ${c.number}</span><strong>${c.label}</strong><small>${c.tags.join(" · ")}</small></div>`,
        )
        .join("")}</div><span class="peek-cta">Click to open</span>`;
      document.body.append(peek);
      listeners.push(() => peek.remove());
      const track = peek.firstChild,
        place = (e) => ({
          x: Math.min(e.clientX + 30, innerWidth - 280),
          y: Math.max(110, Math.min(e.clientY - 95, innerHeight - 210)),
        }),
        moveX = gsap.quickTo(peek, "x", { duration: 0.6, ease: "power3" }),
        moveY = gsap.quickTo(peek, "y", { duration: 0.6, ease: "power3" }),
        lean = gsap.quickTo(peek, "rotation", {
          duration: 0.5,
          ease: "power3",
        });
      let lastX = 0,
        settle;
      gsap.set(peek, { scale: 0.6, rotation: 0 });
      on(list, "pointerenter", (e) => {
        const p = place(e);
        gsap.set(peek, { x: p.x, y: p.y });
        moveX(p.x);
        moveY(p.y);
        lastX = e.clientX;
        gsap.to(peek, {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          ease: "back.out(1.7)",
          overwrite: "auto",
        });
      });
      on(list, "pointermove", (e) => {
        const p = place(e);
        moveX(p.x);
        moveY(p.y);
        lean(gsap.utils.clamp(-9, 9, (e.clientX - lastX) * 0.7));
        lastX = e.clientX;
        settle?.kill();
        settle = gsap.delayedCall(0.12, () => lean(0));
      });
      on(list, "pointerleave", () =>
        gsap.to(peek, {
          opacity: 0,
          scale: 0.6,
          duration: 0.3,
          ease: "power2.in",
          overwrite: "auto",
        }),
      );
      list.querySelectorAll(".work-select").forEach((row, i) => {
        on(row, "pointerenter", () =>
          gsap.to(track, {
            y: -190 * i,
            duration: 0.55,
            ease: "power3.inOut",
            overwrite: true,
          }),
        );
        on(row, "click", () =>
          gsap.fromTo(
            peek,
            { scale: 0.92 },
            { scale: 1, duration: 0.4, ease: "back.out(3)" },
          ),
        );
      });
    }
  });
  cleanup = () => {
    listeners.forEach((fn) => fn());
    ctx.revert();
    gsap.ticker.remove(tick);
    lenis.destroy();
    document.querySelector(".intro-curtain").hidden = true;
    document.querySelector(".page-transition").hidden = true;
    dispatchEvent(new CustomEvent("hero-progress", { detail: 0 }));
  };
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
setup();
preference.addEventListener("change", setup);
