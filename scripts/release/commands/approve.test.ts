import assert from 'node:assert/strict';
import {
  afterEach,
  beforeEach,
  describe,
  it,
  mock,
} from 'node:test';
import { approveAfterReview, confirmMasterIsMerged } from './approve.ts';
import type { ApproveResult } from '../lib/npm.ts';
import { parseVersion } from '../lib/version.ts';

const ENV_NAMES = ['CI', 'GITHUB_AUTH_TOKEN', 'GITHUB_AUTH'];

const REVIEW_PENDING = 'npm error code E409\nnpm error 409 Conflict - POST https://registry.npmjs.org/-/stage/***/approve - @shopgate/engage@7.32.2-alpha.2 can\'t be approved yet because automated review hasn\'t finished. Try again in a few minutes.';

const staged = {
  id: '428275a4',
  packageName: '@shopgate/engage',
  version: '7.32.2-alpha.2',
};

/**
 * Creates a fake "npm stage approve" that returns the given results one after another.
 * @param results The results of the attempts.
 * @returns The mock.
 */
const mockApprove = (...results: ApproveResult[]) => {
  const queue = [...results];
  return mock.fn(async () => queue.shift() ?? {
    status: 0,
    stderr: '',
  });
};

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

  describe('approveAfterReview', () => {
    it('approves once without waiting', async () => {
      const approve = mockApprove({
        status: 0,
        stderr: '',
      });

      await approveAfterReview(staged, '123456', approve, 0);
      assert.deepEqual(approve.mock.calls[0].arguments, ['428275a4', '123456']);
      assert.equal(approve.mock.callCount(), 1);
    });

    it('retries while npm\'s automated review is running', async () => {
      const approve = mockApprove(
        {
          status: 1,
          stderr: REVIEW_PENDING,
        },
        {
          status: 1,
          stderr: REVIEW_PENDING,
        },
        {
          status: 0,
          stderr: '',
        }
      );

      await approveAfterReview(staged, '123456', approve, 0);
      assert.equal(approve.mock.callCount(), 3);
    });

    it('gives up when the review takes longer than the attempts', async () => {
      const approve = mockApprove(...Array.from({ length: 3 }, () => ({
        status: 1,
        stderr: REVIEW_PENDING,
      })));

      await assert.rejects(
        approveAfterReview(staged, '123456', approve, 0, 3),
        /automated review of @shopgate\/engage@7\.32\.2-alpha\.2 still isn't finished/
      );
      assert.equal(approve.mock.callCount(), 3);
    });

    it('fails right away for other errors', async () => {
      const approve = mockApprove({
        status: 1,
        stderr: 'npm error code EOTP',
      });

      await assert.rejects(
        approveAfterReview(staged, '123456', approve, 0),
        /Approving @shopgate\/engage@7\.32\.2-alpha\.2 failed/
      );
      assert.equal(approve.mock.callCount(), 1);
    });
  });
});
