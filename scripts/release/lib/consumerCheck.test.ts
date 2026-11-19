import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  afterEach, beforeEach, describe, it,
} from 'node:test';
import { checkConsumer, createConsumerSource, getTypedModules } from './consumerCheck.ts';
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
          names: ['c', 'default'],
        },
      ]);
    });

    it('lists a module that only has a default export', () => {
      write('defaultOnly.js', 'export default 1;');
      write('defaultOnly.d.ts');

      assert.deepEqual(getTypedModules(packages), [
        {
          specifier: '@shopgate/engage/defaultOnly',
          names: ['default'],
        },
      ]);
    });

    it('skips modules without declarations, without names or without a JavaScript file', () => {
      write('untyped.js', 'export const a = 1;');
      write('empty.js', 'const a = 1;');
      write('empty.d.ts');
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

  describe('checkConsumer', () => {
    /**
     * Creates a repository root whose only installed package is the compiler of this repository.
     * @returns Absolute path of the root.
     */
    const createRepository = () => {
      const repository = path.join(root, 'repository');
      const bin = path.join(repository, 'node_modules', '.bin');

      fs.mkdirSync(path.join(repository, 'node_modules', '@shopgate'), { recursive: true });
      fs.mkdirSync(bin);
      fs.symlinkSync(
        path.resolve(import.meta.dirname, '../../../node_modules/.bin/tsc'),
        path.join(bin, 'tsc')
      );

      return repository;
    };

    beforeEach(() => {
      write('package.json', JSON.stringify({ name: '@shopgate/engage' }));
      write('tsconfig.extension.json', JSON.stringify({
        compilerOptions: {
          strict: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          noEmit: true,
          types: [],
        },
      }));
      write('index.js', 'export const a = 1;\nexport default a;');
    });

    it('passes when the declarations provide every name and the default export', () => {
      write('index.d.ts', 'export declare const a = 1;\ndeclare const _default: number;\nexport default _default;\n');

      assert.equal(checkConsumer(packages, createRepository()), 1);
    });

    it('fails when the declarations lack the default export', () => {
      write('index.d.ts', 'export declare const a = 1;\n');

      assert.throws(
        () => checkConsumer(packages, createRepository()),
        /@shopgate\/engage: TS2339: Property 'default' does not exist/
      );
    });

    it('fails when a declaration names a type that does not resolve', () => {
      write('index.d.ts', 'export declare const a = 1;\ndeclare const _default: number;\nexport default _default;\n');
      write('core/helpers.d.ts', 'export declare const b: Missing;\n');

      assert.throws(
        () => checkConsumer(packages, createRepository()),
        /engage\/core\/helpers\.d\.ts\(1,25\): TS2304: Cannot find name 'Missing'/
      );
    });

    [
      {
        code: 'TS2552',
        declaration: 'export declare const b: Arra<number>;',
        message: "Cannot find name 'Arra'",
      },
      {
        code: 'TS2503',
        declaration: 'export declare const b: Missing.Item;',
        message: "Cannot find namespace 'Missing'",
      },
      {
        code: 'TS2694',
        declaration: 'declare namespace Shop { type Item = number; }\nexport declare const b: Shop.Product;',
        message: "Shop' has no exported member 'Product'",
      },
      {
        code: 'TS2724',
        declaration: "import type { ProductIten } from './types';\nexport declare const b: ProductIten;",
        message: "has no exported member named 'ProductIten'",
      },
      {
        code: 'TS2305',
        declaration: "import type { Product } from './types';\nexport declare const b: Product;",
        message: 'has no exported member .Product.',
      },
      {
        code: 'TS2307',
        declaration: "import type { Item } from './missing';\nexport declare const b: Item;",
        message: "Cannot find module './missing'",
      },
    ].forEach(({ code, declaration, message }) => {
      it(`fails on ${code} in a declaration`, () => {
        write('index.d.ts', 'export declare const a = 1;\ndeclare const _default: number;\nexport default _default;\n');
        write('core/types.d.ts', 'export type Item = number;\nexport type ProductItem = number;\n');
        write('core/helpers.d.ts', `${declaration}\n`);

        assert.throws(
          () => checkConsumer(packages, createRepository()),
          new RegExp(`engage/core/helpers\\.d\\.ts\\(\\d+,\\d+\\): ${code}: .*${message}`)
        );
      });
    });

    it('fails on a mistyped module path despite the fallback for untyped modules', () => {
      write('tsconfig.extension.json', JSON.stringify({
        compilerOptions: {
          strict: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          noEmit: true,
          types: ['@shopgate/engage/untyped-modules'],
        },
      }));
      write('untyped-modules.d.ts', "declare module '@shopgate/*';\n");
      write('index.d.ts', "import type { Item } from '@shopgate/engage/core/typez';\nexport declare const a: Item;\ndeclare const _default: number;\nexport default _default;\n");

      assert.throws(
        () => checkConsumer(packages, createRepository()),
        /engage\/index\.d\.ts\(1,27\): TS2307: Cannot find module '@shopgate\/engage\/core\/typez'/
      );
    });

    it('passes when a module resolves to its JavaScript file, which extensions get as any', () => {
      write('tsconfig.extension.json', JSON.stringify({
        compilerOptions: {
          strict: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          noEmit: true,
          types: [],
          paths: { '@shopgate/engage': ['./index.js'] },
        },
      }));
      write('index.d.ts', 'export declare const a = 1;\ndeclare const _default: number;\nexport default _default;\n');

      assert.equal(checkConsumer(packages, createRepository()), 1);
    });

    it('fails on errors outside of declaration files', () => {
      write('index.d.ts', 'export declare const a = 1;\ndeclare const _default: number;\nexport default _default;\n');
      write('tsconfig.extension.json', JSON.stringify({ compilerOptions: { unknownOption: true } }));

      assert.throws(
        () => checkConsumer(packages, createRepository()),
        /tsconfig\.extension\.json\(1,\d+\): error TS5023: Unknown compiler option 'unknownOption'/
      );
    });

    it('fails with the error output when the compiler fails without type errors', () => {
      const repository = createRepository();
      const tsc = path.join(repository, 'node_modules', '.bin', 'tsc');

      fs.rmSync(tsc);
      fs.writeFileSync(tsc, '#!/bin/sh\necho "Out of memory" >&2\nexit 1\n', { mode: 0o755 });

      assert.throws(
        () => checkConsumer(packages, repository),
        /tsc exited with status 1: Out of memory/
      );
    });

    it('ignores other errors in the declarations and errors of other packages', () => {
      const repository = createRepository();

      /**
       * Installs a third-party package with a single declaration file.
       * @param name The name of the package.
       * @param file The name of the declaration file.
       * @param content The content of the declaration file.
       */
      const install = (name: string, file: string, content: string) => {
        const library = path.join(repository, 'node_modules', name);

        fs.mkdirSync(library);
        fs.writeFileSync(path.join(library, 'package.json'), JSON.stringify({
          name,
          types: file,
        }));
        fs.writeFileSync(path.join(library, file), content);
      };

      install('library', 'index.d.ts', 'export type B = Missing;\n');
      install('module-library', 'index.d.mts', 'export type C = Missing;\nexport declare const c: Promise;\n');
      write('index.d.ts', [
        "import type { B } from 'library';",
        "import type { C } from 'module-library';",
        'export declare const a: B | C;',
        'export declare function b({ missing }: string): void;',
        'declare const _default: number;',
        'export default _default;',
        '',
      ].join('\n'));

      assert.equal(checkConsumer(packages, repository), 1);
    });
  });
});
