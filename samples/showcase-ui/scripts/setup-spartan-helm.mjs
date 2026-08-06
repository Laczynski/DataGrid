import { execSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const showcaseRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const componentsJson = join(showcaseRoot, 'components.json');

if (!existsSync(componentsJson)) {
  writeFileSync(
    componentsJson,
    `${JSON.stringify(
      {
        componentsPath: 'src/app/shared/spartan',
        importAlias: '@spartan-ng/helm',
        style: 'vega',
      },
      null,
      2,
    )}\n`,
    'utf8',
  );
}

const run = (command) => {
  execSync(command, { cwd: showcaseRoot, stdio: 'inherit' });
};

run(
  'npx ng g @spartan-ng/cli:ui-theme --project=showcase-ui --theme=zinc --styles-entry-point=src/styles.scss --defaults',
);

for (const primitive of [
  'button',
  'input',
  'checkbox',
  'select',
  'popover',
  'tooltip',
  'spinner',
  'dropdown-menu',
]) {
  run(`npx ng g @spartan-ng/cli:ui ${primitive} --defaults`);
}

console.log('Spartan helm primitives ready under src/app/shared/spartan/');
