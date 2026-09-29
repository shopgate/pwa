import assert from 'node:assert/strict';
import {
  afterEach,
  beforeEach,
  describe,
  it,
  mock,
} from 'node:test';
import { checkMasterIsMerged, checkVersion } from './check.ts';
import type { ReleaseOptions } from './lib/options.ts';
import { parseVersion } from './lib/version.ts';

const ENV_NAMES = ['CI', 'GITHUB_AUTH_TOKEN', 'GITHUB_AUTH'];

/**
 * Creates release options with safe defaults.
 * @param version The version.
 * @param overrides Options that differ from the defaults.
 * @returns The release options.
 */
const createOptions = (
  version: string,
  overrides: Partial<ReleaseOptions> = {}
): ReleaseOptions => ({
  version: parseVersion(version),
  branch: 'feature',
  updateMaster: false,
  draftRelease: true,
  resume: false,
  dryRun: false,
  ...overrides,
});

/**
 * Replaces fetch with a stub for the GitHub compare API.
 * @param missing Number of master commits that are missing in the branch.
 * @returns The fetch mock.
 */
const mockCompare = (missing: number) => mock.method(
  globalThis,
  'fetch',
  async () => new Response(JSON.stringify({
    ahead_by: missing,
    commits: Array.from({ length: missing }, (_, index) => ({ commit: { message: `Commit ${index}` } })),
  }))
);

describe('check', () => {
  let savedEnv: Record<string, string | undefined>;

  beforeEach(() => {
    savedEnv = Object.fromEntries(ENV_NAMES.map(name => [name, process.env[name]]));
    ENV_NAMES.forEach((name) => {
      delete process.env[name];
    });
    mock.method(console, 'log', () => undefined);
    mock.method(console, 'warn', () => undefined);
  });

  afterEach(() => {
    mock.restoreAll();
    ENV_NAMES.forEach((name) => {
      if (savedEnv[name] === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = savedEnv[name];
      }
    });
  });

  describe('checkVersion', () => {
    it('requires a GitHub token in CI before any request', async () => {
      process.env.CI = 'true';
      const fetchMock = mockCompare(0);

      await assert.rejects(checkVersion(createOptions('7.33.0')), /GITHUB_AUTH_TOKEN is not set/);
      assert.equal(fetchMock.mock.callCount(), 0);
    });
  });

  describe('checkMasterIsMerged', () => {
    it('is skipped without a branch', async () => {
      const fetchMock = mockCompare(3);

      await checkMasterIsMerged(createOptions('7.33.0', {
        branch: '',
        updateMaster: true,
      }));
      assert.equal(fetchMock.mock.callCount(), 0);
    });

    it('fails for stable releases that update master when master commits are missing', async () => {
      mockCompare(3);

      await assert.rejects(
        checkMasterIsMerged(createOptions('7.33.0', { updateMaster: true })),
        /Merge master into feature before releasing 7.33.0/
      );
    });

    it('only warns for stable releases without master update', async () => {
      mockCompare(3);

      await checkMasterIsMerged(createOptions('7.33.0'));
    });

    it('only warns for pre-releases', async () => {
      mockCompare(3);

      await checkMasterIsMerged(createOptions('7.33.0-beta.1', { updateMaster: true }));
    });

    it('passes when the branch contains master', async () => {
      mockCompare(0);

      await checkMasterIsMerged(createOptions('7.33.0', { updateMaster: true }));
    });

    it('fails when the branch does not exist', async () => {
      mock.method(globalThis, 'fetch', async () => new Response('{}', { status: 404 }));

      await assert.rejects(
        checkMasterIsMerged(createOptions('7.33.0')),
        /Can't compare feature with master/
      );
    });
  });
});
