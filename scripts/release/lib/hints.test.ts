import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getCommandHint, getGithubHint } from './hints.ts';

describe('hints', () => {
  describe('getCommandHint', () => {
    it('suggests a retry and the SSH key for git pushes', () => {
      [
        ['push', 'origin', 'releases/v7.33.0'],
        ['subtree', 'push', '-q', '--prefix=themes/theme-gmd', 'git@github.com:shopgate/theme-gmd.git', 'HEAD:master'],
      ].forEach((args) => {
        const hint = getCommandHint('git', args);
        assert.match(hint ?? '', /^Retry the job/);
        assert.match(hint ?? '', /SSH_GITHUB_AUTH/);
      });
    });

    it('explains merge conflicts with a theme master', () => {
      assert.match(getCommandHint('git', ['subtree', 'pull', '-q', '--prefix=themes/theme-gmd']) ?? '', /merge conflict.*README/);
    });

    it('explains merge conflicts with master', () => {
      assert.match(getCommandHint('git', ['merge', '--no-edit', 'origin/master']) ?? '', /Merge master into the release branch by hand/);
    });

    it('suggests a retry when GitHub is unreachable', () => {
      ['fetch', 'clone', 'ls-remote'].forEach((subcommand) => {
        assert.match(getCommandHint('git', [subcommand, 'origin']) ?? '', /^GitHub may have been unreachable/);
      });
    });

    it('names the trusted publisher for publishing', () => {
      assert.match(getCommandHint('npm', ['publish', 'libraries/engage/dist']) ?? '', /trusted publisher/);
    });

    it('has no hint for local commands', () => {
      assert.equal(getCommandHint('git', ['commit', '-m', 'Released 7.33.0']), undefined);
      assert.equal(getCommandHint('node', ['build.js']), undefined);
    });
  });

  describe('getGithubHint', () => {
    it('distinguishes token, permission and GitHub problems', () => {
      assert.match(getGithubHint(401), /invalid or expired/);
      assert.match(getGithubHint(403), /no access or hit the rate limit/);
      assert.match(getGithubHint(429), /rate limit/);
      assert.match(getGithubHint(502), /githubstatus\.com/);
    });
  });
});
