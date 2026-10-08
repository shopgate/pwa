import assert from 'node:assert/strict';
import {
  afterEach,
  beforeEach,
  describe,
  it,
  mock,
} from 'node:test';
import {
  checkMasterIsMerged,
  checkVersion,
  findTakenPackages,
  getContinuation,
  isReleased,
} from './check.ts';
import type { ReleaseOptions } from '../lib/options.ts';
import { parseVersion } from '../lib/version.ts';

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
  skipMasterUpdate: false,
  resume: false,
  dryRun: false,
  waitForPublish: false,
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

      await checkMasterIsMerged(createOptions('7.33.0', { branch: '' }), true);
      assert.equal(fetchMock.mock.callCount(), 0);
    });

    it('fails for releases that update master when master commits are missing', async () => {
      mockCompare(3);

      await assert.rejects(
        checkMasterIsMerged(createOptions('7.33.0'), true),
        /Merge master into feature before releasing 7.33.0/
      );
    });

    it('only warns for releases without master update', async () => {
      mockCompare(3);

      await checkMasterIsMerged(createOptions('7.33.0'), false);
    });

    it('passes when the branch contains master', async () => {
      mockCompare(0);

      await checkMasterIsMerged(createOptions('7.33.0'), true);
    });

    it('fails when the branch does not exist', async () => {
      mock.method(globalThis, 'fetch', async () => new Response('{}', { status: 404 }));

      await assert.rejects(
        checkMasterIsMerged(createOptions('7.33.0'), false),
        /Can't compare feature with master/
      );
    });
  });

  describe('getContinuation', () => {
    const version = parseVersion('7.33.0');
    const messages = [
      "Created changelog for version 'v7.33.0'.",
      'Released 7.33.0\n\nPipeline: 123',
      'Some feature',
    ];

    it('continues a job retried in the pipeline that created the release commit', () => {
      assert.equal(getContinuation(messages, version, false, '123'), 'retry');
    });

    it('needs RESUME in another pipeline', () => {
      assert.equal(getContinuation(messages, version, false, '456'), null);
      assert.equal(getContinuation(messages, version, true, '456'), 'resume');
    });

    it('needs RESUME outside of a pipeline', () => {
      assert.equal(getContinuation(messages, version, false), null);
      assert.equal(getContinuation(messages, version, true), 'resume');
    });

    it('never continues without the release commit of this version', () => {
      assert.equal(getContinuation(['Released 7.33.1\n\nPipeline: 123'], version, true, '123'), null);
    });

    it('supports release commits without pipeline', () => {
      assert.equal(getContinuation(['Released 7.33.0'], version, false, '123'), null);
      assert.equal(getContinuation(['Released 7.33.0'], version, true, '123'), 'resume');
    });
  });

  describe('isReleased', () => {
    const version = parseVersion('7.33.0');
    const taken = (...locations: string[]) => locations.map(location => ({
      location,
      detail: 'exists',
    }));
    const tag = 'shopgate/pwa tag v7.33.0';
    const branch = 'shopgate/pwa branch releases/v7.33.0';

    it('is true with the tag and without the release branch', () => {
      assert.equal(isReleased(taken(tag, 'npm @shopgate/engage@7.33.0'), version), true);
    });

    it('is false while the release branch exists', () => {
      assert.equal(isReleased(taken(tag, branch), version), false);
    });

    it('is false without the tag', () => {
      assert.equal(isReleased(taken(branch), version), false);
      assert.equal(isReleased(taken('shopgate/theme-gmd tag v7.33.0'), version), false);
    });
  });

  describe('findTakenPackages', () => {
    it('lists published packages in the order of the names', async () => {
      const states: Record<string, 'published' | null> = {
        '@shopgate/pwa-core': 'published',
        '@shopgate/pwa-common': null,
        '@shopgate/engage': 'published',
      };

      const taken = await findTakenPackages(
        Object.keys(states),
        '7.33.0',
        async name => states[name]
      );

      assert.deepEqual(taken, [
        {
          location: 'npm @shopgate/pwa-core@7.33.0',
          detail: 'published',
        },
        {
          location: 'npm @shopgate/engage@7.33.0',
          detail: 'published',
        },
      ]);
    });

    it('looks up at most six packages at the same time', async () => {
      let running = 0;
      let maximum = 0;
      const names = Array.from({ length: 13 }, (_, index) => `@shopgate/package-${index}`);

      await findTakenPackages(names, '7.33.0', async () => {
        running += 1;
        maximum = Math.max(maximum, running);
        await new Promise((resolve) => {
          setTimeout(resolve, 5);
        });
        running -= 1;
        return null;
      });

      assert.equal(maximum, 6);
    });
  });
});
