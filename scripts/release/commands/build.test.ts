import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { normalize } from './build.ts';

/**
 * Lists all files below a directory.
 * @param dir The directory.
 * @returns File paths relative to the directory with forward slashes on every OS, sorted.
 */
const listFiles = (dir: string) => (
  fs.readdirSync(dir, {
    recursive: true,
    withFileTypes: true,
  })
    .filter(entry => entry.isFile())
    .map(entry => path.relative(dir, path.join(entry.parentPath, entry.name)).split(path.sep).join('/'))
    .sort()
);

describe('normalize', () => {
  it('removes everything that must not be published', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'release-build-'));

    [
      'package.json',
      'index.js',
      'index.d.ts',
      'tsconfig.json',
      'tsconfig.build.json',
      'helpers/index.js',
      'helpers/index.spec.js',
      'helpers/spec.js',
      'helpers/__tests__/index.js',
      'helpers/tests/index.js',
      'helpers/__mocks__/index.js',
      'helpers/__snapshots__/index.spec.js.snap',
      'helpers/mocks/product.js',
    ].forEach((file) => {
      fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
      fs.writeFileSync(path.join(dir, file), '');
    });

    normalize(dir);

    assert.deepEqual(listFiles(dir), [
      'helpers/index.js',
      'helpers/mocks/product.js',
      'index.d.ts',
      'index.js',
      'package.json',
    ]);

    fs.rmSync(dir, {
      recursive: true,
      force: true,
    });
  });
});
