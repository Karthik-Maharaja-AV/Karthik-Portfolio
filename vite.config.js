import { defineConfig } from "vite";
import { profile } from "./src/data.js";
const origin = (
  process.env.SITE_URL ||
  profile.domain ||
  "https://YOUR-DOMAIN.example"
).replace(/\/$/, "");
if (!/^https:\/\/[^/]+$/.test(origin))
  throw new Error("SITE_URL must be an HTTPS origin without a path.");
export default defineConfig({
  plugins: [
    {
      name: "portfolio-domain",
      transformIndexHtml(html) {
        return html.replaceAll("https://YOUR-DOMAIN.example", origin);
      },
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "robots.txt",
          source: `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
        });
        this.emitFile({
          type: "asset",
          fileName: "sitemap.xml",
          source: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>`,
        });
      },
    },
  ],
});
