import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  afterEach, beforeEach, describe, it,
} from 'node:test';
import { createConsumerSource, getTypedModules } from './consumerCheck.ts';
import type { PublishedPackage } from './starExports.ts';

describe('consumer check of the type declarations', () => {
  let root: string;
  let packages: PublishedPackage[];

  /**
   * Writes a file into the test package.
   * @param file The path relative to the package.
   * @param content The content of the file.
   */
  const write = (file: string, content = '') => {
    fs.mkdirSync(path.dirname(path.join(root, 'engage', file)), { recursive: true });
    fs.writeFileSync(path.join(root, 'engage', file), content);
  };

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'release-consumer-check-'));
    packages = [{
      name: '@shopgate/engage',
      dir: path.join(root, 'engage'),
    }];
  });

  afterEach(() => {
    fs.rmSync(root, {
      recursive: true,
      force: true,
    });
  });

  describe('getTypedModules', () => {
    it('lists the modules with declarations and the names of their JavaScript files', () => {
      write('index.js', 'export const a = 1;');
      write('index.d.ts');
      write('core/index.js', 'export * from "./helpers";\nexport const b = 1;');
      write('core/index.d.ts');
      write('core/helpers.js', 'export const c = 1;\nexport default c;');
      write('core/helpers.d.ts');

      assert.deepEqual(getTypedModules(packages), [
        {
          specifier: '@shopgate/engage',
          names: ['a'],
        },
        {
          specifier: '@shopgate/engage/core',
          names: ['c', 'b'],
        },
        {
          specifier: '@shopgate/engage/core/helpers',
          names: ['c'],
        },
      ]);
    });

    it('skips modules without declarations, without names or without a JavaScript file', () => {
      write('untyped.js', 'export const a = 1;');
      write('defaultOnly.js', 'export default 1;');
      write('defaultOnly.d.ts');
      write('types.d.ts');

      assert.deepEqual(getTypedModules(packages), []);
    });
  });

  describe('createConsumerSource', () => {
    it('reads every name of every module', () => {
      assert.equal(
        createConsumerSource([
          {
            specifier: '@shopgate/engage',
            names: ['a'],
          },
          {
            specifier: '@shopgate/engage/core',
            names: ['b', 'c'],
          },
        ]),
        [
          "import * as m0 from '@shopgate/engage';",
          'export const n0 = [m0.a];',
          "import * as m1 from '@shopgate/engage/core';",
          'export const n1 = [m1.b, m1.c];',
        ].join('\n')
      );
    });
  });
});
