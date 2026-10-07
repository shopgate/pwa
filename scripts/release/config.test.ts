import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { PUBLISHABLE_PACKAGES, ROOT, getPackageName } from './config.ts';

describe('PUBLISHABLE_PACKAGES', () => {
  it('lists runtime dependencies before the packages that need them', () => {
    const names = PUBLISHABLE_PACKAGES.map(pkg => getPackageName(pkg.dir));

    PUBLISHABLE_PACKAGES.forEach((pkg, index) => {
      const { dependencies = {}, peerDependencies = {} } = JSON.parse(
        fs.readFileSync(path.join(ROOT, pkg.dir, 'package.json'), 'utf8')
      );

      [...Object.keys(dependencies), ...Object.keys(peerDependencies)]
        .filter(name => names.includes(name))
        .forEach((name) => {
          assert.ok(names.indexOf(name) < index, `${name} must be listed before ${names[index]}`);
        });
    });
  });
});
