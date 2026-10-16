import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';

const IMPORT_FROM = /^\s*(?:import|export)\b[^;'"]*?\bfrom\s*['"]([^'"]+)['"]/gm;
const IMPORT_ONLY = /^\s*import\s*['"]([^'"]+)['"]/gm;

describe('imports of the release tooling', () => {
  it('only loads Node.js modules and own files with import statements', () => {
    const dir = import.meta.dirname;

    const packageImports = fs.readdirSync(dir, {
      recursive: true,
      withFileTypes: true,
    })
      .filter(entry => entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts'))
      .flatMap((entry) => {
        const file = path.join(entry.parentPath, entry.name);

        const content = fs.readFileSync(file, 'utf8');

        return [...content.matchAll(IMPORT_FROM), ...content.matchAll(IMPORT_ONLY)]
          .map(([, specifier]) => specifier)
          .filter(specifier => !specifier.startsWith('node:') && !specifier.startsWith('.'))
          .filter(specifier => !specifier.includes('${'))
          .map(specifier => `${path.relative(dir, file)}: ${specifier}`);
      });

    assert.deepEqual(
      packageImports,
      [],
      'The release tooling also runs before the dependencies are installed (e.g. "check"). Load npm packages when they are needed, not with an import statement.'
    );
  });
});
