import {
  cpSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const spartanSrc = join(root, "src", "npm", "packages", "spartan", "src");
const schematicFiles = join(
  root,
  "src",
  "npm",
  "packages",
  "cli",
  "schematics",
  "spartan-grid",
  "files",
);

const BRAIN = "@laczynski/datagrid-spartan";

const BRAIN_IMPORT_REWRITES = [
  ['from "./create-grid-resource"', `from "${BRAIN}"`],
  ['from "./filter-feed"', `from "${BRAIN}"`],
  ['from "./filter-mapper"', `from "${BRAIN}"`],
  ['from "./sort-mapper"', `from "${BRAIN}"`],
  ['from "./grid-column-layout-controls"', `from "${BRAIN}"`],
  ['from "./grid-column-visibility-controls"', `from "${BRAIN}"`],
  ['from "./grid-export-controls"', `from "${BRAIN}"`],
  ['from "./grid-row-selection-controls"', `from "${BRAIN}"`],
  ['from "./grid-scroll-controls"', `from "${BRAIN}"`],
  ['from "./grid-views-controls"', `from "${BRAIN}"`],
  ['from "./i18n"', `from "${BRAIN}"`],
  ['from "./match-mode-options"', `from "${BRAIN}"`],
  ['from "./types"', `from "${BRAIN}"`],
  ['from "./table/column.directive"', `from "${BRAIN}"`],
  ['from "./table/column-resize.directive"', `from "${BRAIN}"`],
  ['from "./table/empty.directive"', `from "${BRAIN}"`],
  ['from "./table/grid-column"', `from "${BRAIN}"`],
  ['from "./table/resolve-grid-columns"', `from "${BRAIN}"`],
  ['from "./table/column-context"', `from "${BRAIN}"`],
  ['from "../filter-mapper"', `from "${BRAIN}"`],
  ['from "../i18n"', `from "${BRAIN}"`],
  ['from "../match-mode-options"', `from "${BRAIN}"`],
  ['from "./grid-column"', `from "${BRAIN}"`],
  ['from "../types"', `from "${BRAIN}"`],
];

function applyRewrites(contents, rewrites) {
  let next = contents;

  for (const [from, to] of rewrites) {
    next = next.replaceAll(from, to);
  }

  return next;
}

function copyFile(sourcePath, destinationPath, transform) {
  mkdirSync(dirname(destinationPath), { recursive: true });
  const contents = readFileSync(sourcePath, "utf8");
  writeFileSync(
    destinationPath,
    transform ? transform(contents) : contents,
    "utf8",
  );
}

function rewriteBrainTs(contents) {
  return applyRewrites(contents, BRAIN_IMPORT_REWRITES);
}

function syncGridShellDirectives() {
  const destination = join(schematicFiles, "grid-shell");
  const files = ["bulk-toolbar.directive.ts", "toolbar.directive.ts"];

  for (const file of files) {
    copyFile(
      join(spartanSrc, file),
      join(destination, file),
      rewriteBrainTs,
    );
  }
}

function syncHlmMigrationGuide() {
  const source = join(root, "docs", "guides", "spartan-l3-hlm.md");
  cpSync(source, join(schematicFiles, "HLM-MIGRATION.md"));
}

mkdirSync(schematicFiles, { recursive: true });
syncGridShellDirectives();
syncHlmMigrationGuide();

console.log(
  `Synced Spartan schematic files to ${relative(root, schematicFiles)}`,
);
