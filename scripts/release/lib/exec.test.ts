import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { describeError } from './exec.ts';

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
