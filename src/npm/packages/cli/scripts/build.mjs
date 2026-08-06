import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = join(packageRoot, "dist");

mkdirSync(distRoot, { recursive: true });
writeFileSync(join(distRoot, ".gitkeep"), "", "utf8");

console.log("CLI package ready (schematics ship from source tree).");
