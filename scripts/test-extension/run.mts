import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..', '..');
const [extension, ...jestArgs] = process.argv.slice(2);

if (!extension) {
  console.error('Usage: npm run test:extension -- <extension name or path> [jest options]');
  process.exit(1);
}

const candidates = [extension, path.join('extensions', extension)]
  .flatMap(dir => [path.resolve(root, dir, 'frontend'), path.resolve(root, dir)]);
const frontendDir = candidates.find(dir => fs.existsSync(path.join(dir, 'jest.config.js')));

if (!frontendDir) {
  console.error(`No jest.config.js found for "${extension}".`);
  process.exit(1);
}

if (!fs.existsSync(path.join(frontendDir, 'node_modules'))) {
  console.error(`${path.relative(root, frontendDir)} has no node_modules. Run "npm install" there first.`);
  process.exit(1);
}

console.log(`Running the tests of ${path.relative(root, frontendDir)} without modules from outside the extension`);

const { status } = spawnSync('npx', [
  'jest',
  '--config',
  path.join(import.meta.dirname, 'jest.config.cjs'),
  ...jestArgs,
], {
  cwd: frontendDir,
  env: {
    ...process.env,
    EXTENSION_FRONTEND_DIR: frontendDir,
  },
  stdio: 'inherit',
});

process.exit(status ?? 1);
