import assert from 'node:assert/strict';
import {
  afterEach,
  beforeEach,
  describe,
  it,
  mock,
} from 'node:test';
import { confirmMasterIsMerged } from './approve.ts';
import { parseVersion } from '../lib/version.ts';

const ENV_NAMES = ['CI', 'GITHUB_AUTH_TOKEN', 'GITHUB_AUTH'];

/**
 * Replaces fetch with a stub for the GitHub compare API.
 * @param missing Number of master commits that are missing in the release branch.
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

describe('approve', () => {
  const version = parseVersion('7.33.0');
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

  describe('confirmMasterIsMerged', () => {
    it('is skipped for releases that leave master unchanged', async () => {
      const fetchMock = mockCompare(3);
      const confirm = mock.fn(async () => 'n');

      await confirmMasterIsMerged(version, false, confirm);
      assert.equal(fetchMock.mock.callCount(), 0);
      assert.equal(confirm.mock.callCount(), 0);
    });

    it('compares the release branch with master without asking when nothing is missing', async () => {
      const fetchMock = mockCompare(0);
      const confirm = mock.fn(async () => 'n');

      await confirmMasterIsMerged(version, true, confirm);
      assert.match(String(fetchMock.mock.calls[0].arguments[0]), /releases%2Fv7\.33\.0\.\.\.master/);
      assert.equal(confirm.mock.callCount(), 0);
    });

    it('cancels the approval when master commits are missing and the answer is no', async () => {
      mockCompare(3);

      await assert.rejects(
        confirmMasterIsMerged(version, true, async () => ''),
        /Approval cancelled/
      );
    });

    it('continues when master commits are missing and the answer is yes', async () => {
      mockCompare(3);
      const confirm = mock.fn(async () => 'Y');

      await confirmMasterIsMerged(version, true, confirm);
      assert.equal(confirm.mock.callCount(), 1);
    });
  });
});
