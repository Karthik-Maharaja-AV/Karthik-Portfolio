Karthik Maharaja AV — Systems, with a human side.

Run locally
  npm ci
  npm run dev
  npm run build
  npm run preview
Node 20 is configured for Netlify. Dependencies are pinned in package.json and package-lock.json.
This is a split-module Vite project; serve it over HTTP rather than opening index.html with file://.

Content to finish before publishing
Edit src/data.js:
- Six verified impact sentences and six sanitized approach step lists.
- profile.email: your chosen public contact address.
- profile.linkedin and profile.trailhead: profile URLs.
- profile.tracker: your Salesforce learning tracker URL.
- profile.resume: /resume.pdf after adding the actual PDF to public/.
- profile.domain: your HTTPS production origin, without a path.
Do not infer achievements from the illustrative animation. The cloud-to-invoice scene is a conceptual story, not a claim that a production Salesforce-to-avs integration exists.

Netlify setup (nothing has been deployed)
1. Push this repository to the GitHub repository you choose.
2. In Netlify, add a project by importing that Git repository. If uploading a larger parent repo, set the base directory to the portfolio folder.
3. Use build command npm run build and publish directory dist; netlify.toml also supplies these and Node 20.
4. Set SITE_URL to your final HTTPS origin, or set profile.domain in src/data.js. The build inserts it into Open Graph / Twitter image URLs, og:url, robots.txt and sitemap.xml.
5. In Domain management, add your custom domain, follow Netlify's DNS instructions, and confirm HTTPS. Rebuild when the final domain changes.
6. Enable form detection in Netlify Forms and redeploy. Confirm the contact form appears.
7. Add a form-submission email notification to your email address in the form notification settings. Send a real test message and verify it arrives.
8. Check /404.html, sharing previews, robots.txt and sitemap.xml on the actual domain.

Contact form
The HTML form includes name, email, message, form-name and honeypot. It submits natively to /thank-you.html without JS. With JS it POSTs URL-encoded data to the same origin and shows an accessible result. The localhost preview intentionally reports that delivery needs Netlify; it never reports a fake successful send. Live delivery and email notifications need testing after deployment.

Implementation
- src/data.js: case studies, product modules and profile placeholders.
- src/styles.css: the single site stylesheet; public/utility.css styles the standalone 404 and confirmation pages.
- interaction.js: case/product controls, profile links and navigation.
- src/story.js: mode controls and SVG fallback; scene.js: lazy procedural Three.js scene.
- src/motion.js: GSAP 3.13.0, ScrollTrigger and Lenis 1.3.11; no remote JS CDNs.
- public/: favicon, social image, static story, utility pages and domain placeholders.
- vite.config.js: substitutes SITE_URL/profile.domain at build time.

Accessibility and motion
Text is at least 12px; representative color ratios are in contrast-check.json. All interactive controls support keyboard focus; case navigation retains focus. Reduced-motion preference suppresses the loader, Lenis, hover/magnetic effects, parallax and 3D download. Reduced-motion and WebGL-failure paths preserve the static story and mode/module descriptions. The 3D loop stops off-screen and in background tabs, caps pixel ratio at 2, and simplifies narrow scenes.

Security and caching
Netlify headers restrict scripts to this origin and external resources to Google Fonts. Inline styles are permitted for GSAP/Lenis-generated transforms; inline scripts and eval are not permitted. Hashed /assets files cache for one year; HTML revalidates. Local HTTP preview with equivalent security headers was checked without CSP errors.

See VALIDATION.txt for phase history, bundle sizes, scores and verification limits.
