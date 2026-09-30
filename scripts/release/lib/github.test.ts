import assert from 'node:assert/strict';
import {
  afterEach,
  beforeEach,
  describe,
  it,
  mock,
} from 'node:test';
import { createRelease, getGithubToken, getMissingCommits } from './github.ts';

const ENV_NAMES = ['GITHUB_AUTH_TOKEN', 'GITHUB_AUTH'];

/**
 * Replaces fetch with a stub that answers every request with the given response.
 * @param status The HTTP status.
 * @param body The JSON body.
 * @returns The fetch mock.
 */
const mockFetch = (status: number, body: unknown = {}) => mock.method(
  globalThis,
  'fetch',
  async () => new Response(JSON.stringify(body), { status })
);

describe('github', () => {
  let savedEnv: Record<string, string | undefined>;

  beforeEach(() => {
    savedEnv = Object.fromEntries(ENV_NAMES.map(name => [name, process.env[name]]));
    ENV_NAMES.forEach((name) => {
      delete process.env[name];
    });
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

  describe('getGithubToken', () => {
    it('prefers GITHUB_AUTH_TOKEN and falls back to GITHUB_AUTH', () => {
      assert.equal(getGithubToken(), undefined);

      process.env.GITHUB_AUTH = 'legacy';
      assert.equal(getGithubToken(), 'legacy');

      process.env.GITHUB_AUTH_TOKEN = 'token';
      assert.equal(getGithubToken(), 'token');
    });
  });

  describe('getMissingCommits', () => {
    it('returns the total and the subjects newest first', async () => {
      const fetchMock = mockFetch(200, {
        ahead_by: 300,
        commits: [
          { commit: { message: 'Older commit\n\nDetails' } },
          { commit: { message: 'Newer commit' } },
        ],
      });

      assert.deepEqual(await getMissingCommits('shopgate/pwa', 'releases/v7.33.0', 'master'), {
        total: 300,
        subjects: ['Newer commit', 'Older commit'],
      });
      assert.equal(
        fetchMock.mock.calls[0].arguments[0],
        'https://api.github.com/repos/shopgate/pwa/compare/releases%2Fv7.33.0...master'
      );
    });

    it('returns null when a branch does not exist', async () => {
      mockFetch(404);

      assert.equal(await getMissingCommits('shopgate/pwa', 'unknown', 'master'), null);
    });
  });

  describe('network errors', () => {
    it('retries GET requests', async () => {
      mock.method(console, 'warn', () => undefined);
      let calls = 0;
      mock.method(globalThis, 'fetch', async () => {
        calls += 1;

        if (calls === 1) {
          throw new TypeError('fetch failed');
        }

        return new Response(JSON.stringify({
          ahead_by: 0,
          commits: [],
        }));
      });

      assert.deepEqual(await getMissingCommits('shopgate/pwa', 'feature', 'master'), {
        total: 0,
        subjects: [],
      });
      assert.equal(calls, 2);
    });

    it('does not retry POST requests', async () => {
      const fetchMock = mock.method(globalThis, 'fetch', async () => {
        throw new TypeError('fetch failed', { cause: new Error('other side closed') });
      });

      await assert.rejects(
        createRelease('shopgate/pwa', {
          tag: 'v7.33.0',
          target: 'master',
          draft: false,
          prerelease: false,
          body: '',
          latest: true,
        }),
        (error: Error) => error.message === 'GitHub API POST /repos/shopgate/pwa/releases failed'
          && (error.cause as Error).message === 'fetch failed'
      );
      assert.equal(fetchMock.mock.callCount(), 1);
    });
  });

  describe('createRelease', () => {
    const options = {
      tag: 'v7.33.0',
      target: 'master',
      draft: false,
      prerelease: false,
      body: '',
      latest: true,
    };

    it('returns the created release', async () => {
      mockFetch(201, {
        id: 1,
        name: 'v7.33.0',
        tag_name: 'v7.33.0',
        draft: false,
      });

      assert.equal((await createRelease('shopgate/pwa', options)).id, 1);
    });

    it('only lets GitHub mark the release as latest when allowed', async () => {
      const fetchMock = mockFetch(201, {
        id: 1,
        name: 'v7.32.3',
        tag_name: 'v7.32.3',
        draft: false,
      });

      await createRelease('shopgate/pwa', options);
      await createRelease('shopgate/pwa', {
        ...options,
        latest: false,
      });

      const bodies = fetchMock.mock.calls
        .map(call => JSON.parse(String((call.arguments[1] as RequestInit).body)));
      assert.equal(bodies[0].make_latest, undefined);
      assert.equal(bodies[1].make_latest, 'false');
    });

    it('throws when the repository is not found', async () => {
      mockFetch(404);

      await assert.rejects(createRelease('shopgate/pwa', options), /Can't create the GitHub release v7.33.0 in shopgate\/pwa/);
    });
  });
});
