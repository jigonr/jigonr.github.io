import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

// Run from the repository root after publishing the compiled CV.
const source = readFileSync("cv-source/resume.tex", "utf8");
const baseline = "ea772a28c5b08195eef367b34a7aff706b0536e8";
for (const file of [
  "assets/img/me.jpg",
  "files/anatomy-domestic-production-networks.pdf",
  "cv-source/resume-openfont.cls",
  "cv-source/font-color.sty",
  "cv-source/lato-font.sty",
  "cv-source/raleway-font.sty",
  "cv-source/build.tex",
]) {
  assert.deepEqual(
    readFileSync(file),
    execFileSync("git", ["show", `${baseline}:${file}`], {
      maxBuffer: 32 * 1024 * 1024,
    }),
    `${file} must remain byte-identical to the approved baseline`,
  );
}
const active = source
  .split("\n")
  .filter((line) => !line.trimStart().startsWith("%"))
  .join("\n");
for (const text of [
  "2024/25–present",
  "\\section{Languages and Citizenship}",
  "Spanish (Native) and English (Fluent)",
  "\\textbf{Citizenship:} Costa Rican",
  "\\textbf{2023:} Conferencia de Economistas Costa Rica.",
  "\\textbf{2025:} Conferencia de Economistas Costa Rica.",
  "{Jordi Blanes i Vidal}",
  "{Lourdes Sosa}",
])
  assert(active.includes(text), `Missing correction: ${text}`);
assert(!/attendance|EconCR2025|\\section\{Skills\}/i.test(active));
assert(
  !/Professor|Ph\. D\.|Senior Economist|Principal Investigator/.test(active),
);
assert.equal((active.match(/\{Seminar Teacher\}/g) ?? []).length, 3);
assert(active.includes("{Seminar Teacher}{London, UK}{2024/25–present}"));
assert(active.includes("\\descript{Teaching Fellow (2026/27)}"));
assert.equal(
  (
    active.match(
      /\{Seminar Teacher\}\{London, UK\}\{Summer 2025 and Summer 2026\}/g,
    ) ?? []
  ).length,
  2,
);
assert(active.includes("{Danial Lashkari}"));
assert(!active.includes("{Daniel Lashkari}"));
assert(
  active.includes(
    "along with André Campos, Alberto Sequeira and Asdrúbal Vargas",
  ),
);
const sections = [...active.matchAll(/\\section\{([^}]+)\}/g)].map((m) => m[1]);
assert.equal(
  sections[sections.indexOf("Research Experience") + 1],
  "Teaching Experience",
);
console.log("PASS: final corrections, section order and protected assets");
