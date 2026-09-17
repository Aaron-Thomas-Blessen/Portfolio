import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import content from "./src/content.json" with { type: "json" };
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const base = content.site.basePath;
if (!base.startsWith("/") || !base.endsWith("/"))
  throw new Error("site.basePath must begin and end with /");
const canonical = `${content.site.origin.replace(/\/$/, "")}${base}`;
const metadata: Plugin = {
  name: "portfolio-metadata",
  transformIndexHtml(html) {
    const values: Record<string, string> = {
      __TITLE__: escape(content.site.title),
      __DESCRIPTION__: escape(content.site.description),
      __CANONICAL__: escape(canonical),
      __OG_IMAGE__: escape(new URL(content.site.ogImage, canonical).href),
      __STRUCTURED_DATA__: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: content.person.name,
        url: canonical,
        description: content.site.description,
        sameAs: [content.person.github, content.person.linkedin],
        email: content.person.email
          ? `mailto:${content.person.email}`
          : undefined,
      }).replace(/</g, "\\u003c"),
    };
    return html.replace(
      /__TITLE__|__DESCRIPTION__|__CANONICAL__|__OG_IMAGE__|__STRUCTURED_DATA__/g,
      (token) => values[token],
    );
  },
  generateBundle() {
    this.emitFile({
      type: "asset",
      fileName: "sitemap.xml",
      source: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(canonical)}</loc></url></urlset>`,
    });
    this.emitFile({
      type: "asset",
      fileName: "robots.txt",
      source: `User-agent: *\nAllow: /\nSitemap: ${canonical}sitemap.xml\n`,
    });
    this.emitFile({ type: "asset", fileName: ".nojekyll", source: "" });
  },
};
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react(), metadata],
  // Local development serves at /. Production/preview use site.basePath.
  base: command === "serve" && !isPreview ? "/" : base,
  server: {
    host: "0.0.0.0",
    port: 4173,
    strictPort: true,
    allowedHosts: ["terminal.local"],
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    strictPort: true,
    allowedHosts: ["terminal.local"],
  },
  build: { target: "es2022", sourcemap: false, emptyOutDir: true },
}));
