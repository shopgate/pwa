import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  compareVersions,
  getDistTag,
  isValidVersion,
  parseVersion,
} from './version.ts';

describe('parseVersion', () => {
  it('parses a stable version', () => {
    assert.deepEqual(parseVersion('7.33.0'), {
      version: '7.33.0',
      name: 'v7.33.0',
      baseName: 'v7.33.0',
      major: 7,
      minor: 33,
      patch: 0,
      preRelease: null,
      preReleaseNumber: null,
      stable: true,
    });
  });

  it('parses pre-releases with "v" prefix and whitespace', () => {
    const version = parseVersion(' v7.33.0-rc.2 ');

    assert.equal(version.version, '7.33.0-rc.2');
    assert.equal(version.name, 'v7.33.0-rc.2');
    assert.equal(version.baseName, 'v7.33.0');
    assert.equal(version.stable, false);
  });

  it('rejects unsupported versions', () => {
    [
      '',
      '7.33',
      '07.33.0',
      '7.33.0-beta',
      '7.33.0-beta.0',
      '7.33.0-next.1',
      '7.33.0+build.1',
    ].forEach((input) => {
      assert.equal(isValidVersion(input), false, input);
      assert.throws(() => parseVersion(input), /Invalid version/);
    });
  });
});

describe('compareVersions', () => {
  const sorted = [
    '7.32.9',
    '7.33.0-alpha.1',
    '7.33.0-alpha.2',
    '7.33.0-beta.1',
    '7.33.0-beta.10',
    '7.33.0-rc.1',
    '7.33.0',
    '7.33.1',
    '8.0.0',
  ];

  it('orders versions semver-like', () => {
    const shuffled = [...sorted].reverse();

    assert.deepEqual(
      shuffled.sort((a, b) => compareVersions(parseVersion(a), parseVersion(b))),
      sorted
    );
  });

  it('treats equal versions as equal', () => {
    assert.equal(compareVersions(parseVersion('7.33.0'), parseVersion('v7.33.0')), 0);
  });
});

describe('getDistTag', () => {
  it('publishes all pre-release types with the "beta" dist-tag', () => {
    ['alpha', 'beta', 'rc'].forEach((type) => {
      assert.equal(getDistTag(parseVersion(`7.33.0-${type}.1`), '7.34.0'), 'beta');
    });
  });

  it('publishes stable versions with the "latest" dist-tag', () => {
    assert.equal(getDistTag(parseVersion('7.33.0'), '7.32.1'), 'latest');
    assert.equal(getDistTag(parseVersion('7.33.0'), '7.33.0'), 'latest');
    assert.equal(getDistTag(parseVersion('7.33.0'), ''), 'latest');
  });

  it('keeps "latest" for patches of older release lines', () => {
    assert.equal(getDistTag(parseVersion('7.32.3'), '7.33.0'), 'latest-7.32');
    assert.equal(getDistTag(parseVersion('6.9.1'), '7.33.0'), 'latest-6.9');
  });
});
