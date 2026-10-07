import assert from 'node:assert/strict';
import {
  afterEach,
  beforeEach,
  describe,
  it,
  mock,
} from 'node:test';
import type { Theme } from '../config.ts';
import { pushSubtrees } from './subtree.ts';

const themes: Theme[] = ['theme-gmd', 'theme-ios11'].map(name => ({
  name,
  dir: `themes/${name}`,
  gitUrl: `git@github.com:shopgate/${name}.git`,
  githubRepo: `shopgate/${name}`,
}));

/**
 * Creates a promise that can be settled from outside.
 * @returns The promise and its resolve and reject functions.
 */
const deferred = () => {
  let resolve: (status: number) => void = () => undefined;
  let reject: (error: Error) => void = () => undefined;
  const promise = new Promise<number>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    promise,
    resolve,
    reject,
  };
};

describe('pushSubtrees', () => {
  beforeEach(() => {
    mock.method(console, 'log', () => undefined);
  });

  afterEach(() => {
    mock.restoreAll();
  });

  it('starts all pushes before the first one has finished', async () => {
    const pushes = themes.map(() => deferred());
    const push = mock.fn((theme: Theme, _commit: string, _branch: string) => (
      pushes[themes.indexOf(theme)].promise
    ));

    const done = pushSubtrees(themes, 'releases/v7.33.0', undefined, push);
    assert.equal(push.mock.callCount(), 2);
    assert.deepEqual(push.mock.calls.map(call => call.arguments), [
      [themes[0], 'HEAD', 'releases/v7.33.0'],
      [themes[1], 'HEAD', 'releases/v7.33.0'],
    ]);

    pushes.forEach(({ resolve }) => resolve(0));
    await done;
  });

  it('waits for the other pushes and names the failed theme', async () => {
    let otherFinished = false;
    const push = mock.fn(async (theme: Theme) => {
      if (theme.name === 'theme-gmd') {
        throw new Error('Command failed (exit 1)');
      }

      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });
      otherFinished = true;
      return 0;
    });

    await assert.rejects(
      pushSubtrees(themes, 'master', undefined, push),
      /^Error: Pushing shopgate\/theme-gmd to master failed/
    );
    assert.equal(otherFinished, true);
  });

  it('pushes each theme from its own commit', async () => {
    const push = mock.fn(async (_theme: Theme, _commit: string, _branch: string) => 0);
    const commits = new Map([[themes[0], 'a1b2c3'], [themes[1], 'd4e5f6']]);

    await pushSubtrees(themes, 'master', theme => commits.get(theme) ?? 'HEAD', push);
    assert.deepEqual(push.mock.calls.map(call => call.arguments), [
      [themes[0], 'a1b2c3', 'master'],
      [themes[1], 'd4e5f6', 'master'],
    ]);
  });

  it('names all failed themes', async () => {
    const push = mock.fn(async () => {
      throw new Error('Command failed (exit 1)');
    });

    await assert.rejects(
      pushSubtrees(themes, 'master', undefined, push),
      /Pushing shopgate\/theme-gmd and shopgate\/theme-ios11 to master failed/
    );
  });
});
