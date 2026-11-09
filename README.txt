Karthik Maharaja AV — Ideas. Engineered.

Run locally
  npm ci
  npm run dev
  npm run build
  npm run preview

The active website is the latest cinematic portfolio: a reflective liquid sculpture,
scroll-controlled camera and iris transition, word reveals, a pinned horizontal
case gallery, product workflows, and a contact form. It uses native document
scrolling rather than a fixed-size embedded preview. Nothing has been deployed.

Implementation
- index.html: semantic page, social metadata, profile links, and Netlify form markup.
- src/cinematic.css: responsive layout, film scenes, themes, and glass surfaces.
- src/cinematic.js: scroll choreography, navigation, gallery, dialogs, and product controls.
- src/liquid-renderer.js: local WebGL shader; no image downloads or external renderer.
- src/icons.js: bundled SVG symbols; no icon CDN.
- src/data.js: verified case-study content, career dates/roles, contribution scope, and profile settings.
- src/experience.js: career timeline markup, month-based tenure calculations, and
  reversible scroll effects with a drawing line, company focus, and role markers.
  Vite renders the career details into HTML; the browser refreshes current tenure.
  Employment details match the LinkedIn Experience screenshot supplied on 9 November 2026.
- src/work.js: Salesforce filters, case-study cards, outcome-led dialogs, and keyboard navigation.
- src/product.js: module scope, personal contributions, and interactive workflow steps.
- src/contact.js: topic selection, inline validation, character count, delivery states,
  timeout handling, and a direct email fallback.
- public/theme.js: light/dark preference, applied before first paint.
- vite.config.js: production origin substitution and generated sitemap/robots.
Previous glass/Three.js/motion source files are retained, but are not imported by
this version. The active page does not load GSAP, Lenis, Three.js, or Google Fonts.

Content before publishing
- Set profile.domain in src/data.js, or the SITE_URL build environment variable,
  to the final HTTPS origin without a path.
- Add a real public/resume.pdf and set profile.resume if résumé access is wanted.
- Individual contributions are identified; illustrative workflows are not screenshots.

Netlify
1. Import this repository. Build command: npm run build. Publish directory: dist.
   netlify.toml configures these defaults and Node 20.
2. Set SITE_URL or profile.domain, configure the domain, and verify HTTPS.
3. Enable Netlify Forms detection and deploy. Add form email notifications.
4. Send a real production test message and verify its delivery and notification.
5. Verify /404.html, sharing previews, /robots.txt and /sitemap.xml on the live domain.

Accessibility and performance
- Keyboard-accessible controls, visible focus, skip link, dialog focus return,
  accessible form feedback, and system/saved light/dark themes.
- Reduced motion removes pinned scroll sequences and preserves ordinary content.
- WebGL failure or context loss preserves the CSS illustration and all text/actions.
- The shader draws on scroll and while the eased camera settles, stops in hidden
  documents, and caps render resolution at 1400 by 1000 pixels.
- Session storage remembers capability/product selections only; document scrolling
  and browser history remain native.
- Local form checks never transmit a test message or claim successful delivery.

See VALIDATION.txt for current verification and historical measurements.
