const { existsSync, readdirSync, readFileSync, statSync } = require("node:fs");
const { join } = require("node:path");

/** @type {Record<string, string[]>} */
const SEGMENTS_BY_LEVEL = {
  "filter-editors": ["filter-editors"],
  full: ["filter-editors", "grid-shell"],
};

/**
 * @param {import('./schema').Schema} options
 */
function spartanGrid(options) {
  const targetPath = normalizePath(options.path || "src/app/shared/query-grid");
  const level = options.level || "filter-editors";
  const segments = SEGMENTS_BY_LEVEL[level] ?? SEGMENTS_BY_LEVEL["filter-editors"];

  return (tree) => {
    const schematicRoot = join(__dirname, "files");

    for (const segment of segments) {
      copyDirectory(tree, join(schematicRoot, segment), join(targetPath, segment));
    }

    if (level === "full" && existsSync(join(schematicRoot, "HLM-MIGRATION.md"))) {
      const migrationPath = `${targetPath}/HLM-MIGRATION.md`;
      const contents = readFileSync(join(schematicRoot, "HLM-MIGRATION.md"));

      if (tree.exists(migrationPath)) {
        tree.overwrite(migrationPath, contents);
      } else {
        tree.create(migrationPath, contents);
      }
    }

    writeReadme(tree, targetPath, level);
    return tree;
  };
}

/**
 * @param {import('@angular-devkit/schematics').Tree} tree
 * @param {string} sourceDir
 * @param {string} destinationDir
 */
function copyDirectory(tree, sourceDir, destinationDir) {
  if (!existsSync(sourceDir)) {
    return;
  }

  for (const entry of readdirSync(sourceDir)) {
    const sourcePath = join(sourceDir, entry);
    const destinationPath = normalizePath(join(destinationDir, entry));

    if (statSync(sourcePath).isDirectory()) {
      copyDirectory(tree, sourcePath, destinationPath);
      continue;
    }

    const contents = readFileSync(sourcePath);

    if (tree.exists(destinationPath)) {
      tree.overwrite(destinationPath, contents);
      continue;
    }

    tree.create(destinationPath, contents);
  }
}

/**
 * @param {import('@angular-devkit/schematics').Tree} tree
 * @param {string} targetPath
 * @param {"filter-editors" | "full"} level
 */
function writeReadme(tree, targetPath, level) {
  const readmePath = `${targetPath}/README.md`;
  if (tree.exists(readmePath)) {
    return;
  }

  const lines = [
    "# QueryGrid Spartan L3",
    "",
    "Copied by `@query-grid/cli:spartan-grid`.",
    "",
    `- Level: \`${level}\``,
    "",
    "## Layout",
    "",
    "- Brain (`createGridResource`, `QgColumnDirective`, …) stays in `@query-grid/spartan`.",
    "- L3 grid shell uses Spartan `hlm*` directly (`@spartan-ng/helm/*` path aliases).",
  ];

  if (level === "filter-editors" || level === "full") {
    lines.push("- `filter-editors/` — column filter popover UI.");
  }

  if (level === "full") {
    lines.push(
      "- `grid-shell/hlm-query-grid.*` — full grid; use `<qg-hlm-query-grid>`.",
      "- `HLM-MIGRATION.md` — Spartan setup notes.",
    );
  }

  tree.create(readmePath, `${lines.join("\n")}\n`);
}

/**
 * @param {string} path
 */
function normalizePath(path) {
  return path.replace(/\\/g, "/").replace(/\/+$/, "");
}

module.exports = spartanGrid;
module.exports.default = spartanGrid;
