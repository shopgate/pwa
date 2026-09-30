import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

const run = (command: string, args: string[]) => {
  const { status } = spawnSync(command, args, { cwd: root, stdio: 'inherit' });

  if (status !== 0) {
    process.exit(status ?? 1);
  }
};

const remove = (relativePath: string) => {
  fs.rmSync(path.join(root, relativePath), { recursive: true, force: true });
};

const { workspaces } = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

console.log('Cleaning repository state');

fs.globSync(workspaces, { cwd: root })
  .forEach(workspace => remove(path.join(workspace, 'node_modules')));
remove('node_modules');
remove('.cache-loader');

fs.globSync(['**/*error.log', '**/*debug.log'], {
  cwd: root,
  exclude: name => name === 'node_modules' || name === '.git',
}).forEach(remove);

run('npm', ['install']);
