import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..', '..');
const tsc = path.join(root, 'node_modules', 'typescript', 'bin', 'tsc');

const projects = [
  ...['libraries', 'utils', 'themes'].flatMap(group => (
    fs.readdirSync(path.join(root, group)).sort().map(name => path.join(group, name))
  )),
  path.join('scripts', 'release'),
].filter(dir => fs.existsSync(path.join(root, dir, 'tsconfig.json')));

const failed = projects.filter((project) => {
  console.log(`Checking types of ${project}`);

  const { status } = spawnSync(process.execPath, [
    tsc,
    '--project',
    project,
    '--noEmit',
    '--pretty',
    ...(project.startsWith('themes') ? ['--types', 'jest,node'] : []),
  ], {
    cwd: root,
    stdio: 'inherit',
  });

  return status !== 0;
});

if (failed.length > 0) {
  console.error(`\nType errors in ${failed.join(', ')}.`);
  process.exit(1);
}

console.log(`\nNo type errors in ${projects.length} projects.`);
