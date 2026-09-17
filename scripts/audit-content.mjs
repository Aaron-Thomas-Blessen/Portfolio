import { readFile, access } from "node:fs/promises";
import path from "node:path";
const root = new URL("../", import.meta.url);
const content = JSON.parse(
  await readFile(new URL("src/content.json", root), "utf8"),
);
const missing = [];
const local = [];
const errors = [];
function walk(value, key = "content") {
  if (!value || typeof value !== "object") return;
  if ("instruction" in value) {
    const field = "value" in value ? "value" : "src" in value ? "src" : "url";
    if (!value[field]) missing.push(`${key}.${field}\n  ${value.instruction}`);
    else if (field !== "value" && !/^(https?:|mailto:|#)/.test(value[field]))
      local.push([`${key}.${field}`, value[field]]);
  }
  for (const [k, v] of Object.entries(value))
    if (typeof v === "object") walk(v, `${key}.${k}`);
}
walk(content);
for (const [key, file] of local) {
  try {
    await access(new URL(`public/${file.replace(/^\//, "")}`, root));
  } catch {
    errors.push(`${key}: missing public/${file}`);
  }
}
for (const group of ["projects", "receipts"]) {
  const ids = new Set();
  for (const item of content[group]) {
    if (ids.has(item.id)) errors.push(`Duplicate ${group} ID: ${item.id}`);
    ids.add(item.id);
  }
}
if (
  !content.site.basePath.startsWith("/") ||
  !content.site.basePath.endsWith("/")
)
  errors.push("site.basePath must begin and end with /.");
console.log(`Content slots still to complete: ${missing.length}\n`);
console.log(missing.join("\n\n"));
console.log(`\nChecked ${local.length} local file references.`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    "All configured local files exist; project and receipt IDs are unique.",
  );
console.log(
  "\nAlso review record notes: Hackverse venue, CODE role/dates, ISRO end date, degree status, and the existing résumé.",
);
