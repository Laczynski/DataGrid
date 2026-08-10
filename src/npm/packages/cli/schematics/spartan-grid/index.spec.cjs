const assert = require("node:assert/strict");
const path = require("node:path");
const { SchematicTestRunner } = require("@angular-devkit/schematics/testing");

const packageRoot = path.join(__dirname, "..", "..");
const collectionPath = path.join(packageRoot, "collection.json");
const runner = new SchematicTestRunner("@laczynski/datagrid-cli", collectionPath);

async function run() {
  const defaultTree = await runner.runSchematic("spartan-grid", {
    path: "src/app/shared/datagrid",
  });

  assert.ok(defaultTree.exists("src/app/shared/datagrid/README.md"));
  assert.ok(
    defaultTree.exists("src/app/shared/datagrid/filter-editors/dg-column-filter.component.ts"),
  );
  assert.equal(
    defaultTree.exists("src/app/shared/datagrid/grid-shell/hlm-data-grid.component.ts"),
    false,
  );

  const filterTree = await runner.runSchematic("spartan-grid", {
    path: "src/app/shared/datagrid",
    level: "filter-editors",
  });

  assert.ok(
    filterTree.exists("src/app/shared/datagrid/filter-editors/dg-column-filter.component.ts"),
  );
  assert.equal(
    filterTree.exists("src/app/shared/datagrid/grid-shell/hlm-data-grid.component.ts"),
    false,
  );

  const filterEntry = filterTree.get(
    "src/app/shared/datagrid/filter-editors/dg-column-filter.component.ts",
  );
  const filterSource = filterEntry.content.toString("utf8");
  assert.match(filterSource, /from "@laczynski\/datagrid-spartan"/);
  assert.match(filterSource, /DG_GRID_HELM_IMPORTS/);

  const fullTree = await runner.runSchematic("spartan-grid", {
    path: "src/app/shared/datagrid",
    level: "full",
  });

  assert.ok(fullTree.exists("src/app/shared/datagrid/grid-shell/hlm-data-grid.component.ts"));
  assert.ok(fullTree.exists("src/app/shared/datagrid/HLM-MIGRATION.md"));

  const gridEntry = fullTree.get(
    "src/app/shared/datagrid/grid-shell/hlm-data-grid.component.ts",
  );
  const gridSource = gridEntry.content.toString("utf8");
  assert.match(gridSource, /HlmDataGridComponent/);
  assert.match(gridSource, /dg-hlm-data-grid/);
  assert.match(gridSource, /from "@laczynski\/datagrid-spartan"/);
  assert.match(gridSource, /DG_GRID_HELM_IMPORTS/);
  assert.doesNotMatch(gridSource, /from "\.\.\/helm"/);

  console.log("spartan-grid schematic tests passed");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
