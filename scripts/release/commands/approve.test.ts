import assert from 'node:assert/strict';
import {
  afterEach,
  beforeEach,
  describe,
  it,
  mock,
} from 'node:test';
import {
  approveAfterReview,
  confirmMasterIsMerged,
  simulateApproval,
  summarizeDurations,
} from './approve.ts';
import { isOtpRejected } from '../lib/npm.ts';
import type { ApproveResult } from '../lib/npm.ts';
import { symbols } from '../lib/symbols.ts';
import { parseVersion } from '../lib/version.ts';

const ENV_NAMES = ['CI', 'GITHUB_AUTH_TOKEN', 'GITHUB_AUTH'];

const REVIEW_PENDING = 'npm error code E409\nnpm error 409 Conflict - POST https://registry.npmjs.org/-/stage/***/approve - @shopgate/engage@7.32.2-alpha.2 can\'t be approved yet because automated review hasn\'t finished. Try again in a few minutes.';

const OTP_REJECTED = 'npm error code EOTP\nnpm error This operation requires a one-time password from your authenticator.';

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

  describe('isOtpRejected', () => {
    it('detects rejected one-time passwords like npm does', () => {
      assert.equal(isOtpRejected(OTP_REJECTED), true);
      assert.equal(isOtpRejected('npm error code E401\nnpm error 401 Unauthorized - This operation requires a one-time password'), true);
      assert.equal(isOtpRejected('npm error code E401\nnpm error 401 Unauthorized - invalid token'), false);
      assert.equal(isOtpRejected(REVIEW_PENDING), false);
    });
  });

  describe('approveAfterReview', () => {
    /**
     * Collects the lines printed with console.log.
     * @returns The printed lines.
     */
    const printedLines = () => (console.log as unknown as ReturnType<typeof mock.fn>).mock.calls
      .map(call => String(call.arguments[0]));

    it('approves once and prints one line', async () => {
      const approve = mockApprove({
        status: 0,
        stderr: '',
      });

      const otp = await approveAfterReview(staged, '123456', '[1/13]', {
        approve,
        delay: 0,
      });
      assert.deepEqual(approve.mock.calls[0].arguments, ['428275a4', '123456']);
      assert.equal(approve.mock.callCount(), 1);
      assert.equal(otp, '123456');
      assert.deepEqual(printedLines(), [`${symbols.ok} [1/13] @shopgate/engage@7.32.2-alpha.2`]);
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

      await approveAfterReview(staged, '123456', '[5/13]', {
        approve,
        delay: 0,
      });
      assert.equal(approve.mock.callCount(), 3);
      assert.equal(printedLines()[0], `${symbols.waiting} [5/13] @shopgate/engage@7.32.2-alpha.2: waiting for npm's automated review (0:00)`);
      assert.equal(printedLines().at(-1), `${symbols.ok} [5/13] @shopgate/engage@7.32.2-alpha.2`);
    });

    it('gives up when the review takes longer than the attempts', async () => {
      const approve = mockApprove(...Array.from({ length: 3 }, () => ({
        status: 1,
        stderr: REVIEW_PENDING,
      })));

      await assert.rejects(
        approveAfterReview(staged, '123456', '[1/13]', {
          approve,
          delay: 0,
          attempts: 3,
        }),
        /automated review of @shopgate\/engage@7\.32\.2-alpha\.2 still isn't finished/
      );
      assert.equal(approve.mock.callCount(), 3);
    });

    it('asks for a new one-time password when npm rejects it and returns it', async () => {
      const approve = mockApprove(
        {
          status: 1,
          stderr: OTP_REJECTED,
        },
        {
          status: 0,
          stderr: '',
        }
      );
      const askOtp = mock.fn(async () => '654321');

      const otp = await approveAfterReview(staged, '123456', '[1/13]', {
        approve,
        askOtp,
        delay: 0,
      });
      assert.equal(askOtp.mock.callCount(), 1);
      assert.deepEqual(approve.mock.calls[1].arguments, ['428275a4', '654321']);
      assert.equal(otp, '654321');
    });

    it('lets npm handle the 2FA without a one-time password and doesn\'t ask again', async () => {
      const approve = mockApprove({
        status: 1,
        stderr: OTP_REJECTED,
      });
      const askOtp = mock.fn(async () => '654321');

      await assert.rejects(
        approveAfterReview(staged, '', '[1/13]', {
          approve,
          askOtp,
          delay: 0,
        }),
        /Approving @shopgate\/engage@7\.32\.2-alpha\.2 failed/
      );
      assert.deepEqual(approve.mock.calls[0].arguments, ['428275a4', '']);
      assert.equal(askOtp.mock.callCount(), 0);
    });

    it('shows npm\'s error output and fails right away for other errors', async () => {
      const consoleError = mock.method(console, 'error', () => undefined);
      const approve = mockApprove({
        status: 1,
        stderr: 'npm error code E401\n',
      });

      await assert.rejects(
        approveAfterReview(staged, '123456', '[1/13]', {
          approve,
          delay: 0,
        }),
        /Approving @shopgate\/engage@7\.32\.2-alpha\.2 failed/
      );
      assert.equal(approve.mock.callCount(), 1);
      assert.deepEqual(consoleError.mock.calls[0].arguments, ['npm error code E401']);
    });
  });

  describe('simulateApproval', () => {
    it('shows the progress lines without approving anything', async () => {
      const second = {
        ...staged,
        id: '9f1c2e7a',
        packageName: '@shopgate/pwa-common',
      };

      await simulateApproval([staged, second], 0);

      const lines = (console.log as unknown as ReturnType<typeof mock.fn>).mock.calls
        .map(call => String(call.arguments[0]));
      const isStatusLine = (line: string) => [symbols.ok, symbols.waiting]
        .some(symbol => line.startsWith(symbol));
      assert.deepEqual(lines.filter(isStatusLine), [
        `${symbols.waiting} [1/2] @shopgate/engage@7.32.2-alpha.2: waiting for npm's automated review (0:00)`,
        `${symbols.ok} [1/2] @shopgate/engage@7.32.2-alpha.2`,
        `${symbols.ok} [2/2] @shopgate/pwa-common@7.32.2-alpha.2`,
      ]);
      assert.equal(lines.at(-1), '\nDry run: nothing was approved.');
    });
  });

  describe('summarizeDurations', () => {
    it('names the slowest package when it took noticeably long', () => {
      assert.equal(
        summarizeDurations([
          {
            packageName: '@shopgate/pwa-core',
            milliseconds: 2000,
          },
          {
            packageName: '@shopgate/engage',
            milliseconds: 90000,
          },
        ], 134000),
        '2 packages in 2:14 (slowest: @shopgate/engage, 1:30)'
      );
    });

    it('only names the total time when all packages were quick', () => {
      assert.equal(summarizeDurations([{
        packageName: '@shopgate/pwa-core',
        milliseconds: 2000,
      }], 2000), '1 package in 0:02');
    });
  });
});
