// Post-build fix for the static export's segment-prefetch files.
//
// `next build` (output: "export") writes a route's prefetch payloads into a folder,
// e.g. out/capabilities/__next.capabilities/__PAGE__.txt, but the client requests
// the flattened name out/capabilities/__next.capabilities.__PAGE__.txt. On a plain
// static host that request 404s. This copies every file inside an `__next.*` folder
// to its flattened sibling name so prefetching works on any static server.
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve(process.argv[2] || "out");
let copied = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("__next.")) flatten(full, dir, entry.name);
    else walk(full);
  }
}

function flatten(segmentDir, parent, base, rel = "") {
  for (const entry of fs.readdirSync(segmentDir, { withFileTypes: true })) {
    const full = path.join(segmentDir, entry.name);
    const nextRel = rel ? `${rel}.${entry.name}` : entry.name;
    if (entry.isDirectory()) flatten(full, parent, base, nextRel);
    else {
      const target = path.join(parent, `${base}.${nextRel}`);
      if (!fs.existsSync(target)) {
        fs.copyFileSync(full, target);
        copied++;
      }
    }
  }
}

if (!fs.existsSync(OUT)) {
  console.error(`flatten-prefetch: ${OUT} not found`);
  process.exit(1);
}
walk(OUT);
console.log(`flatten-prefetch: ${copied} prefetch file(s) flattened in ${path.relative(process.cwd(), OUT) || "."}`);
