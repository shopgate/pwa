import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { setTimeout } from 'node:timers/promises';
import { mapWithLimit } from './concurrency.ts';

describe('mapWithLimit', () => {
  it('keeps the order of the items although calls finish in a different order', async () => {
    const results = await mapWithLimit([30, 10, 20], 3, async (delay) => {
      await setTimeout(delay);
      return delay * 2;
    });

    assert.deepEqual(results, [60, 20, 40]);
  });

  it('runs at most the given number of calls at the same time', async () => {
    let running = 0;
    let maximum = 0;

    await mapWithLimit(Array.from({ length: 13 }, (_, index) => index), 6, async () => {
      running += 1;
      maximum = Math.max(maximum, running);
      await setTimeout(5);
      running -= 1;
    });

    assert.equal(maximum, 6);
  });

  it('handles fewer items than the limit and no items', async () => {
    assert.deepEqual(await mapWithLimit([1], 6, async item => item), [1]);
    assert.deepEqual(await mapWithLimit([], 6, async item => item), []);
  });

  it('rejects when a call fails', async () => {
    await assert.rejects(
      mapWithLimit([1, 2, 3], 2, async (item) => {
        if (item === 2) {
          throw new Error('npm view failed');
        }
        return item;
      }),
      /npm view failed/
    );
  });
});
