import assert from 'node:assert/strict';
import {
  afterEach, beforeEach, describe, it, mock,
} from 'node:test';
import { removeReleaseBranches } from './cleanup.ts';

describe('removeReleaseBranches', () => {
  beforeEach(() => {
    mock.method(console, 'log', () => undefined);
    mock.method(console, 'warn', () => undefined);
  });

  afterEach(() => {
    mock.restoreAll();
  });

  it('removes the branch on every remote in the given order', () => {
    const removed: string[] = [];

    removeReleaseBranches(['theme', 'origin'], 'releases/v7.34.0', 'v7.34.0', {
      branchExists: () => true,
      tagExists: () => true,
      remove: (remote, branch) => removed.push(`${remote} ${branch}`),
    });

    assert.deepEqual(removed, ['theme releases/v7.34.0', 'origin releases/v7.34.0']);
  });

  it('skips remotes where the branch is gone already', () => {
    const removed: string[] = [];

    removeReleaseBranches(['theme', 'origin'], 'releases/v7.34.0', 'v7.34.0', {
      branchExists: remote => remote === 'origin',
      tagExists: () => true,
      remove: remote => removed.push(remote),
    });

    assert.deepEqual(removed, ['origin']);
  });

  it('continues with the other remotes when a deletion fails', () => {
    const removed: string[] = [];

    assert.doesNotThrow(() => removeReleaseBranches(['theme', 'origin'], 'releases/v7.34.0', 'v7.34.0', {
      branchExists: () => true,
      tagExists: () => true,
      remove: (remote) => {
        if (remote === 'theme') {
          throw new Error('remote rejected');
        }

        removed.push(remote);
      },
    }));

    assert.deepEqual(removed, ['origin']);
  });

  it('continues when a remote can\'t be asked', () => {
    const removed: string[] = [];

    assert.doesNotThrow(() => removeReleaseBranches(['theme', 'origin'], 'releases/v7.34.0', 'v7.34.0', {
      branchExists: (remote) => {
        if (remote === 'theme') {
          throw new Error('unreachable');
        }

        return true;
      },
      tagExists: () => true,
      remove: remote => removed.push(remote),
    }));

    assert.deepEqual(removed, ['origin']);
  });

  it('keeps the branch where the tag is missing', () => {
    const removed: string[] = [];
    const tags: string[] = [];

    removeReleaseBranches(['theme', 'origin'], 'releases/v7.34.0', 'v7.34.0', {
      branchExists: () => true,
      tagExists: (remote, tag) => {
        tags.push(tag);
        return remote === 'origin';
      },
      remove: remote => removed.push(remote),
    });

    assert.deepEqual(removed, ['origin']);
    assert.deepEqual(tags, ['v7.34.0', 'v7.34.0']);
  });
});
