const assert = require("node:assert/strict");
const path = require("node:path");
const { SchematicTestRunner } = require("@angular-devkit/schematics/testing");

const packageRoot = path.join(__dirname, "..", "..");
const collectionPath = path.join(packageRoot, "collection.json");
const runner = new SchematicTestRunner("@query-grid/cli", collectionPath);

async function run() {
  const defaultTree = await runner.runSchematic("spartan-grid", {
    path: "src/app/shared/query-grid",
  });

  assert.ok(defaultTree.exists("src/app/shared/query-grid/README.md"));
  assert.ok(
    defaultTree.exists("src/app/shared/query-grid/filter-editors/qg-column-filter.component.ts"),
  );
  assert.equal(
    defaultTree.exists("src/app/shared/query-grid/grid-shell/hlm-query-grid.component.ts"),
    false,
  );

  const filterTree = await runner.runSchematic("spartan-grid", {
    path: "src/app/shared/query-grid",
    level: "filter-editors",
  });

  assert.ok(
    filterTree.exists("src/app/shared/query-grid/filter-editors/qg-column-filter.component.ts"),
  );
  assert.equal(
    filterTree.exists("src/app/shared/query-grid/grid-shell/hlm-query-grid.component.ts"),
    false,
  );

  const filterEntry = filterTree.get(
    "src/app/shared/query-grid/filter-editors/qg-column-filter.component.ts",
  );
  const filterSource = filterEntry.content.toString("utf8");
  assert.match(filterSource, /from "@query-grid\/spartan"/);
  assert.match(filterSource, /QG_GRID_HELM_IMPORTS/);

  const fullTree = await runner.runSchematic("spartan-grid", {
    path: "src/app/shared/query-grid",
    level: "full",
  });

  assert.ok(fullTree.exists("src/app/shared/query-grid/grid-shell/hlm-query-grid.component.ts"));
  assert.ok(fullTree.exists("src/app/shared/query-grid/HLM-MIGRATION.md"));

  const gridEntry = fullTree.get(
    "src/app/shared/query-grid/grid-shell/hlm-query-grid.component.ts",
  );
  const gridSource = gridEntry.content.toString("utf8");
  assert.match(gridSource, /HlmQueryGridComponent/);
  assert.match(gridSource, /qg-hlm-query-grid/);
  assert.match(gridSource, /from "@query-grid\/spartan"/);
  assert.match(gridSource, /QG_GRID_HELM_IMPORTS/);
  assert.doesNotMatch(gridSource, /from "\.\.\/helm"/);

  console.log("spartan-grid schematic tests passed");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
