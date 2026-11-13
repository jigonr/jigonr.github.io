import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

// Run from the repository root. The public PDF is intentionally held unchanged.
const source = readFileSync("cv-source/resume.tex", "utf8");
const baseline = "ea772a28c5b08195eef367b34a7aff706b0536e8";
for (const file of [
  "index.html",
  "assets/img/me.jpg",
  "files/anatomy-domestic-production-networks.pdf",
  "files/cv/CV_Jose_Ignacio_Gonzalez_Rojas.pdf",
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
    `${file} must remain byte-identical during preparation`,
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
assert.equal((active.match(/\{Seminar Teacher\}/g) ?? []).length, 2);
// These baseline fields await the researcher's answers, not an inference.
assert(active.includes("{Teaching Fellow}{London, UK}{2024/25–present}"));
assert(active.includes("{Seminar Teacher}{London, UK}{2026, Session Two}"));
assert(active.includes("{Seminar Teacher}{London, UK}{2026}"));
const sections = [...active.matchAll(/\\section\{([^}]+)\}/g)].map((m) => m[1]);
assert.equal(
  sections[sections.indexOf("Research Experience") + 1],
  "Teaching Experience",
);
console.log(
  "PASS: corrections, deferred-field preservation, section order and publication hold",
);
