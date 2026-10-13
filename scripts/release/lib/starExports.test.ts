import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  afterEach, beforeEach, describe, it,
} from 'node:test';
import { getExportNames, rewriteAllStarExports } from './starExports.ts';
import type { PublishedPackage } from './starExports.ts';

describe('star exports of declaration files', () => {
  let root: string;
  let packages: PublishedPackage[];

  /**
   * Writes a file into one of the test packages.
   * @param file The path relative to the test root, e.g. "engage/index.d.ts".
   * @param content The content of the file.
   */
  const write = (file: string, content: string) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), content);
  };

  /**
   * Reads a file of one of the test packages.
   * @param file The path relative to the test root.
   * @returns The content of the file.
   */
  const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'release-star-exports-'));
    packages = [
      {
        name: '@shopgate/engage',
        dir: path.join(root, 'engage'),
      },
      {
        name: '@shopgate/pwa-common',
        dir: path.join(root, 'common'),
      },
    ];
  });

  afterEach(() => {
    fs.rmSync(root, {
      recursive: true,
      force: true,
    });
  });

  describe('getExportNames', () => {
    it('collects every kind of named export', () => {
      write('common/names.js', [
        'export const a = 1, b = 2;',
        'export function c() {}',
        'export class D {}',
        'export const { e, f: g, ...h } = {};',
        'export const [i, , j = 1] = [];',
        'const k = 1;',
        'export { k, k as l };',
        'export { default as m, n } from "./other";',
        'export * as o from "./other";',
        'export default k;',
      ].join('\n'));

      assert.deepEqual(
        getExportNames(path.join(root, 'common/names.js'), packages),
        ['a', 'b', 'c', 'D', 'e', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o']
      );
    });

    it('follows star exports inside the published packages', () => {
      write('common/index.js', 'export * from "./a";\nexport * from "@shopgate/engage/b";\nexport * from "rxjs";');
      write('common/a/index.js', 'export const a = 1;\nexport * from "../index";');
      write('engage/b.js', 'export const b = 1;\nexport default b;');

      assert.deepEqual(getExportNames(path.join(root, 'common/index.js'), packages), ['a', 'b']);
    });
  });

  describe('rewriteAllStarExports', () => {
    it('lists the names of a module without declarations', () => {
      write('engage/index.d.ts', 'export * from "@shopgate/pwa-common/constants/ActionTypes";\n');
      write('common/constants/ActionTypes.js', 'export const SUCCESS_LOGIN = "SUCCESS_LOGIN";\nexport const ERROR_LOGIN = "ERROR_LOGIN";\n');

      assert.deepEqual(rewriteAllStarExports(packages), []);
      assert.equal(
        read('engage/index.d.ts'),
        'export { SUCCESS_LOGIN, ERROR_LOGIN } from "@shopgate/pwa-common/constants/ActionTypes";\n'
      );
    });

    it('keeps star exports to modules with declarations and to other packages', () => {
      const content = [
        'export * from "./typed";',
        'export * from "@shopgate/pwa-common/typed";',
        'export * from "rxjs";',
        '',
      ].join('\n');

      write('engage/index.d.ts', content);
      write('engage/typed.d.ts', 'export declare const a: string;\n');
      write('engage/typed.js', 'export const a = "";\n');
      write('common/typed/index.d.ts', 'export declare const b: string;\n');
      write('common/typed/index.js', 'export const b = "";\n');

      assert.deepEqual(rewriteAllStarExports(packages), []);
      assert.equal(read('engage/index.d.ts'), content);
    });

    it('leaves out names the declaration file already exports', () => {
      write('engage/index.d.ts', [
        'export declare const a: string;',
        'export { b, x as c } from "./typed";',
        "export * from '@shopgate/pwa-common/first';",
        "export * from '@shopgate/pwa-common/second';",
        '',
      ].join('\n'));
      write('common/first.js', 'export const a = 1, b = 2, c = 3, d = 4;\n');
      write('common/second.js', 'export const d = 4, e = 5;\n');

      rewriteAllStarExports(packages);

      assert.equal(read('engage/index.d.ts'), [
        'export declare const a: string;',
        'export { b, x as c } from "./typed";',
        "export { d } from '@shopgate/pwa-common/first';",
        "export { e } from '@shopgate/pwa-common/second';",
        '',
      ].join('\n'));
    });

    it('reports a star export to a module whose exports can not be read', () => {
      write('engage/index.d.ts', 'export * from "@shopgate/pwa-common/commonjs";\n');
      write('common/commonjs.js', 'exports.a = 1;\n');

      assert.deepEqual(rewriteAllStarExports(packages), [{
        file: path.join(root, 'engage/index.d.ts'),
        specifier: '@shopgate/pwa-common/commonjs',
      }]);
    });

    it('reports a star export to a module that is not published', () => {
      write('engage/index.d.ts', 'export * from "@shopgate/pwa-common/missing";\n');
      fs.mkdirSync(path.join(root, 'common'));

      assert.deepEqual(rewriteAllStarExports(packages), [{
        file: path.join(root, 'engage/index.d.ts'),
        specifier: '@shopgate/pwa-common/missing',
      }]);
      assert.equal(read('engage/index.d.ts'), 'export * from "@shopgate/pwa-common/missing";\n');
    });
  });
});
