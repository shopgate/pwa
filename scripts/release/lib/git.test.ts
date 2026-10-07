import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  afterEach,
  beforeEach,
  describe,
  it,
} from 'node:test';
import { capture } from './exec.ts';
import { getWorkingTreeChanges } from './git.ts';

describe('git', () => {
  describe('getWorkingTreeChanges', () => {
    let root: string;

    beforeEach(() => {
      root = fs.mkdtempSync(path.join(os.tmpdir(), 'release-git-'));
      capture('git', ['init', '-q'], { cwd: root });
      fs.writeFileSync(path.join(root, '.gitignore'), 'node_modules\n');
      fs.writeFileSync(path.join(root, 'package.json'), '{}\n');
      capture('git', ['add', '.'], { cwd: root });
      capture('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-q', '-m', 'Initial'], { cwd: root });
    });

    afterEach(() => {
      fs.rmSync(root, {
        recursive: true,
        force: true,
      });
    });

    it('is empty for a clean working tree with ignored files', () => {
      fs.mkdirSync(path.join(root, 'node_modules'));
      fs.writeFileSync(path.join(root, 'node_modules', 'index.js'), '');

      assert.equal(getWorkingTreeChanges(root), '');
    });

    it('lists changed and untracked files', () => {
      fs.writeFileSync(path.join(root, 'package.json'), '{"name":"changed"}\n');
      fs.writeFileSync(path.join(root, 'generated.js'), '');

      assert.equal(getWorkingTreeChanges(root), ' M package.json\n?? generated.js');
    });
  });
});
