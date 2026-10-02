import assert from 'node:assert/strict';
import {
  afterEach,
  beforeEach,
  describe,
  it,
  mock,
} from 'node:test';
import { capture, describeError, runAsync } from './exec.ts';

describe('describeError', () => {
  it('includes the causes and error codes', () => {
    const socketError = Object.assign(new Error('other side closed'), { code: 'UND_ERR_SOCKET' });
    const fetchError = new TypeError('fetch failed', { cause: socketError });
    const error = new Error('GitHub API GET /repos/shopgate/pwa/releases failed', { cause: fetchError });

    assert.equal(
      describeError(error),
      'GitHub API GET /repos/shopgate/pwa/releases failed: fetch failed: other side closed (UND_ERR_SOCKET)'
    );
  });

  it('handles values that are no errors', () => {
    assert.equal(describeError('failed'), 'failed');
  });
});

describe('runAsync', () => {
  beforeEach(() => {
    mock.method(console, 'log', () => undefined);
  });

  afterEach(() => {
    mock.restoreAll();
  });

  it('resolves with the exit status', async () => {
    assert.equal(await runAsync('node', ['-e', 'process.exit(0)']), 0);
  });

  it('runs commands at the same time', async () => {
    const started = Date.now();
    await Promise.all([1, 2].map(() => runAsync('node', ['-e', 'setTimeout(() => {}, 500)'])));

    assert.ok(Date.now() - started < 900);
  });

  it('adds a hint how to continue to failed commands', async () => {
    await assert.rejects(
      runAsync('git', ['push', '/nonexistent/release-test', 'HEAD'], { allowFailure: false }),
      /Command failed \(exit \d+\): git push \/nonexistent\/release-test HEAD\nRetry the job/
    );
  });

  it('rejects when the command fails', async () => {
    await assert.rejects(
      runAsync('node', ['-e', 'process.exit(3)']),
      /Command failed \(exit 3\): node -e process\.exit\(3\)/
    );
  });

  it('resolves with the failed status when failures are allowed', async () => {
    assert.equal(await runAsync('node', ['-e', 'process.exit(3)'], { allowFailure: true }), 3);
  });

  it('passes the environment to the command', async () => {
    const status = await runAsync(
      'node',
      ['-e', 'process.exit(process.env.RELEASE_TEST === "yes" ? 0 : 1)'],
      { env: { RELEASE_TEST: 'yes' } }
    );

    assert.equal(status, 0);
  });
});

describe('capture', () => {
  it('adds the error output and a hint how to continue to failed commands', () => {
    assert.throws(
      () => capture('git', ['push', '/nonexistent/release-test', 'HEAD']),
      /Command failed \(exit \d+\): git push \/nonexistent\/release-test HEAD\n.*nonexistent.*\n[\s\S]*Retry the job/
    );
  });
});
