import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const showcaseRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(showcaseRoot, '..', '..');
const schematicFiles = join(
  repoRoot,
  'src',
  'npm',
  'packages',
  'cli',
  'schematics',
  'spartan-grid',
  'files',
);
const destination = join(showcaseRoot, 'src', 'app', 'shared', 'datagrid');

execSync('node scripts/sync-spartan-schematic-files.mjs', {
  cwd: repoRoot,
  stdio: 'inherit',
});

mkdirSync(destination, { recursive: true });

for (const part of ['grid-shell', 'filter-editors']) {
  const target = join(destination, part);
  rmSync(target, { recursive: true, force: true });
  cpSync(join(schematicFiles, part), target, { recursive: true });
}

cpSync(join(schematicFiles, 'HLM-MIGRATION.md'), join(destination, 'HLM-MIGRATION.md'));

console.log(`Synced L3 Spartan consumer grid (grid-shell + filter-editors) to ${destination}`);
