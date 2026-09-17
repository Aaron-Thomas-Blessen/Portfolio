import { createServer } from "vite";
import { readFile, writeFile } from "node:fs/promises";
const content = JSON.parse(
  await readFile(new URL("../src/content.json", import.meta.url), "utf8"),
);
const server = await createServer({
  base: content.site.basePath,
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});
try {
  const { render } = await server.ssrLoadModule("/src/entry-server.tsx");
  const path = new URL("../dist/index.html", import.meta.url);
  const template = await readFile(path, "utf8");
  if (!template.includes("<!--app-html-->"))
    throw new Error("Missing prerender insertion point.");
  await writeFile(path, template.replace("<!--app-html-->", render()));
  console.log(
    "Prerendered the complete portfolio for SEO and no-JavaScript reading.",
  );
} finally {
  await server.close();
}
