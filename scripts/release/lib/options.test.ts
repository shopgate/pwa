import assert from 'node:assert/strict';
import {
  afterEach,
  beforeEach,
  describe,
  it,
} from 'node:test';
import { getOptions } from './options.ts';

const ENV_NAMES = ['VERSION', 'BRANCH', 'UPDATE_MASTER', 'DRAFT_RELEASE', 'RESUME', 'DRY_RUN'];

describe('getOptions', () => {
  let savedEnv: Record<string, string | undefined>;

  beforeEach(() => {
    savedEnv = Object.fromEntries(ENV_NAMES.map(name => [name, process.env[name]]));
    ENV_NAMES.forEach((name) => {
      delete process.env[name];
    });
  });

  afterEach(() => {
    ENV_NAMES.forEach((name) => {
      if (savedEnv[name] === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = savedEnv[name];
      }
    });
  });

  it('uses safe defaults', () => {
    const options = getOptions(['7.33.0']);

    assert.equal(options.version.version, '7.33.0');
    assert.equal(options.branch, '');
    assert.equal(options.updateMaster, false);
    assert.equal(options.draftRelease, true);
    assert.equal(options.resume, false);
    assert.equal(options.dryRun, false);
  });

  it('reads the GitLab form variables', () => {
    Object.assign(process.env, {
      VERSION: '7.33.0-beta.1',
      BRANCH: 'develop7',
      UPDATE_MASTER: 'true',
      DRAFT_RELEASE: 'false',
      RESUME: 'true',
      DRY_RUN: 'true',
    });

    const options = getOptions([]);

    assert.equal(options.version.version, '7.33.0-beta.1');
    assert.equal(options.branch, 'develop7');
    assert.equal(options.updateMaster, true);
    assert.equal(options.draftRelease, false);
    assert.equal(options.resume, true);
    assert.equal(options.dryRun, true);
  });

  it('prefers command line arguments over variables', () => {
    Object.assign(process.env, {
      VERSION: '7.33.0',
      BRANCH: 'develop7',
    });

    const options = getOptions(['7.34.0', '--branch', 'feature', '--dry-run']);

    assert.equal(options.version.version, '7.34.0');
    assert.equal(options.branch, 'feature');
    assert.equal(options.dryRun, true);
  });

  it('fails without version', () => {
    assert.throws(() => getOptions([]), /No version given/);
  });

  it('supports negated flags', () => {
    process.env.DRAFT_RELEASE = 'true';

    assert.equal(getOptions(['7.33.0', '--no-draft-release']).draftRelease, false);
  });

  it('rejects malformed boolean variables', () => {
    process.env.DRAFT_RELEASE = 'tru';

    assert.throws(() => getOptions(['7.33.0']), /Invalid value "tru" for DRAFT_RELEASE/);
  });
});
