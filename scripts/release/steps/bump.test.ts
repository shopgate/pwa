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
import { bumpVersions, getWorkspaceDirs, updateLockfile } from './bump.ts';

/**
 * Writes a JSON file into the fixture directory and creates missing folders.
 * @param root The fixture root.
 * @param file File path relative to the root.
 * @param content The JSON content.
 */
const writeJson = (root: string, file: string, content: unknown) => {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), `${JSON.stringify(content, null, 2)}\n`);
};

/**
 * Reads a JSON file from the fixture directory.
 * @param root The fixture root.
 * @param file File path relative to the root.
 * @returns The parsed content.
 */
const readJson = (root: string, file: string) => (
  JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
);

describe('bump', () => {
  let root: string;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'release-bump-'));

    writeJson(root, 'package.json', {
      private: true,
      workspaces: ['libraries/*', 'themes/*', 'extensions/theme-config/frontend'],
    });
    writeJson(root, 'repos.json', {
      themes: { 'theme-gmd': 'git@github.com:shopgate/theme-gmd.git' },
    });
    writeJson(root, 'libraries/common/package.json', {
      name: '@shopgate/pwa-common',
      version: '7.32.0',
      dependencies: { lodash: '^4.17.21' },
    });
    writeJson(root, 'libraries/engage/package.json', {
      name: '@shopgate/engage',
      version: '7.32.0',
      dependencies: {
        '@shopgate/native-modules': '1.0.0-beta.34',
        '@shopgate/pwa-common': '7.32.0',
      },
      devDependencies: {
        '@shopgate/pwa-unit-test': '7.31.3',
      },
    });
    writeJson(root, 'libraries/unit-tests/package.json', {
      name: '@shopgate/pwa-unit-test',
      version: '7.32.0',
    });
    fs.mkdirSync(path.join(root, 'libraries/empty-folder'));
    writeJson(root, 'themes/theme-gmd/package.json', {
      name: '@shopgate/theme-gmd',
      version: '7.32.0',
      dependencies: {
        '@shopgate/engage': '7.32.0',
        '@shopgate/pwa-common': '^7.0.0',
      },
    });
    writeJson(root, 'themes/theme-gmd/extension-config.json', {
      version: '7.32.0',
      id: '@shopgate/theme-gmd',
    });
    writeJson(root, 'extensions/theme-config/frontend/package.json', {
      name: '@shopgate/theme-config',
      version: '7.32.0',
      peerDependencies: { '@shopgate/pwa-common': '>=7.20.0' },
    });
  });

  afterEach(() => {
    fs.rmSync(root, {
      recursive: true,
      force: true,
    });
  });

  it('expands the workspace patterns to package directories', () => {
    assert.deepEqual(getWorkspaceDirs(root).sort(), [
      'extensions/theme-config/frontend',
      'libraries/common',
      'libraries/engage',
      'libraries/unit-tests',
      'themes/theme-gmd',
    ]);
  });

  it('bumps all versions and exact internal pins', () => {
    bumpVersions('7.33.0-beta.1', root);

    assert.deepEqual(readJson(root, 'libraries/engage/package.json'), {
      name: '@shopgate/engage',
      version: '7.33.0-beta.1',
      dependencies: {
        '@shopgate/native-modules': '1.0.0-beta.34',
        '@shopgate/pwa-common': '7.33.0-beta.1',
      },
      devDependencies: {
        '@shopgate/pwa-unit-test': '7.33.0-beta.1',
      },
    });
    assert.deepEqual(readJson(root, 'themes/theme-gmd/package.json').dependencies, {
      '@shopgate/engage': '7.33.0-beta.1',
      '@shopgate/pwa-common': '^7.0.0',
    });
    assert.deepEqual(readJson(root, 'extensions/theme-config/frontend/package.json'), {
      name: '@shopgate/theme-config',
      version: '7.33.0-beta.1',
      peerDependencies: { '@shopgate/pwa-common': '>=7.20.0' },
    });
    assert.equal(readJson(root, 'libraries/common/package.json').dependencies.lodash, '^4.17.21');
  });

  it('bumps the theme extension-config.json', () => {
    bumpVersions('7.33.0', root);

    assert.deepEqual(readJson(root, 'themes/theme-gmd/extension-config.json'), {
      version: '7.33.0',
      id: '@shopgate/theme-gmd',
    });
  });

  it('keeps the formatting of extension-config.json', () => {
    const file = path.join(root, 'themes/theme-gmd/extension-config.json');
    fs.writeFileSync(file, '{\n  "version": "7.32.0",\n  "id": "x",\n  "rate": 1.0,\n  "a":  "b" ,\n  "nested": { "version": "1.0.0" }\n}\n');

    bumpVersions('7.33.0', root);

    assert.equal(
      fs.readFileSync(file, 'utf8'),
      '{\n  "version": "7.33.0",\n  "id": "x",\n  "rate": 1.0,\n  "a":  "b" ,\n  "nested": { "version": "1.0.0" }\n}\n'
    );
  });

  it('keeps the key order and doesn\'t add missing dependency maps', () => {
    bumpVersions('7.33.0', root);

    assert.equal(
      fs.readFileSync(path.join(root, 'libraries/unit-tests/package.json'), 'utf8'),
      '{\n  "name": "@shopgate/pwa-unit-test",\n  "version": "7.33.0"\n}\n'
    );
  });
});

describe('updateLockfile', () => {
  let root: string;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'release-lockfile-'));

    writeJson(root, 'package.json', {
      private: true,
      workspaces: ['libraries/*', 'extensions/theme-config/frontend'],
    });
    writeJson(root, 'repos.json', { themes: {} });
    writeJson(root, 'libraries/common/package.json', {
      name: '@shopgate/pwa-common',
      version: '7.32.0',
    });
    writeJson(root, 'extensions/theme-config/frontend/package.json', {
      name: '@shopgate/theme-config',
      version: '7.32.0',
      private: true,
      peerDependencies: { '@shopgate/pwa-common': '>=7.20.0' },
    });
    updateLockfile(root);
  });

  afterEach(() => {
    fs.rmSync(root, {
      recursive: true,
      force: true,
    });
  });

  it('writes prerelease versions, which peer ranges like ">=7.20.0" don\'t include', () => {
    bumpVersions('7.33.0-beta.1', root);
    updateLockfile(root);

    const { packages } = readJson(root, 'package-lock.json');
    assert.equal(packages['libraries/common'].version, '7.33.0-beta.1');
    assert.equal(packages['extensions/theme-config/frontend'].version, '7.33.0-beta.1');
  });
});
