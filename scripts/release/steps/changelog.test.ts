import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  UNRELEASED,
  assignCategories,
  extractReleaseNotes,
  findPreviousTag,
  findPullRequestId,
  getPreviousTagPrefix,
  groupByRelease,
  insertIntoChangelog,
  parseCommits,
  renderRelease,
} from './changelog.ts';
import type { CommitInfo } from './changelog.ts';
import type { GithubIssue } from '../lib/github.ts';
import { parseVersion } from '../lib/version.ts';

const LABELS = {
  enhancement: ':rocket: Enhancement',
  bug: ':bug: Bug Fix',
  internal: ':house: Internal',
};

/**
 * Creates a commit fixture.
 * @param overrides Values that differ from the defaults.
 * @returns The commit.
 */
const commit = (overrides: Partial<CommitInfo>): CommitInfo => ({
  sha: 'abc1234',
  summary: 'Some commit',
  date: '2026-08-01',
  tags: [],
  issueNumber: null,
  categories: [],
  ...overrides,
});

/**
 * Creates a pull request fixture.
 * @param number The PR number.
 * @param title The PR title.
 * @param labels The PR labels.
 * @param login The author login.
 * @returns The pull request.
 */
const pullRequest = (
  number: number,
  title: string,
  labels: string[],
  login: string
): GithubIssue => ({
  number,
  title,
  labels: labels.map(name => ({ name })),
  user: {
    login,
    html_url: `https://github.com/${login}`,
  },
  pull_request: { html_url: `https://github.com/shopgate/pwa/pull/${number}` },
});

describe('getPreviousTagPrefix', () => {
  it('uses the current minor for patch releases', () => {
    assert.equal(getPreviousTagPrefix(parseVersion('7.32.1')), 'v7.32.');
  });

  it('uses the previous minor for minor releases, also for pre-releases', () => {
    assert.equal(getPreviousTagPrefix(parseVersion('7.32.0')), 'v7.31.');
    assert.equal(getPreviousTagPrefix(parseVersion('7.32.0-beta.3')), 'v7.31.');
  });

  it('uses the previous major for major releases', () => {
    assert.equal(getPreviousTagPrefix(parseVersion('7.0.0')), 'v6.');
    assert.equal(getPreviousTagPrefix(parseVersion('0.0.0')), 'v0.');
  });
});

describe('findPreviousTag', () => {
  const tags = ['v7.31.2', 'v7.31.10', 'v7.31.9', 'v7.31.11-beta.1', 'v7.3.99', 'v7.32.0', 'other'];

  it('returns the highest stable tag with the prefix', () => {
    assert.equal(findPreviousTag(tags, 'v7.31.', parseVersion('7.32.0')), 'v7.31.10');
  });

  it('ignores the tag of the released version and higher ones', () => {
    assert.equal(findPreviousTag(tags, 'v7.31.', parseVersion('7.31.10')), 'v7.31.9');
  });

  it('finds the highest lower tag of all release lines with the prefix "v"', () => {
    assert.equal(findPreviousTag(tags, 'v', parseVersion('7.33.0')), 'v7.32.0');
  });

  it('returns null without matching tag', () => {
    assert.equal(findPreviousTag(tags, 'v6.', parseVersion('7.0.0')), null);
  });
});

describe('findPullRequestId', () => {
  it('detects merge and squash commits', () => {
    assert.equal(findPullRequestId('Merge pull request #1469 from shopgate/CURB-5783'), '1469');
    assert.equal(findPullRequestId('Fix search phrase (#1502)'), '1502');
    assert.equal(findPullRequestId('Auto merge of #12 - branch'), '12');
  });

  it('ignores other commits', () => {
    assert.equal(findPullRequestId('Released 7.32.0'), null);
    assert.equal(findPullRequestId('Mention (#12) in the middle'), null);
  });
});

describe('parseCommits', () => {
  it('parses the fields and keeps only stable tags', () => {
    const log = [
      'aaa1111\x1fHEAD -> releases/v7.32.0\x1fSubject; with separator (#12)\x1f2026-09-25',
      'bbb2222\x1ftag: v7.31.9, tag: v7.31.9-beta.1, origin/master\x1fReleased 7.31.9\x1f2026-09-18',
    ].join('\n');

    assert.deepEqual(parseCommits(log), [
      commit({
        sha: 'aaa1111',
        summary: 'Subject; with separator (#12)',
        date: '2026-09-25',
        issueNumber: '12',
      }),
      commit({
        sha: 'bbb2222',
        summary: 'Released 7.31.9',
        date: '2026-09-18',
        tags: ['v7.31.9'],
      }),
    ]);
  });
});

describe('groupByRelease', () => {
  it('splits commits at stable tags', () => {
    const releases = groupByRelease([
      commit({ sha: '1' }),
      commit({
        sha: '2',
        tags: ['v7.31.9'],
        date: '2026-09-18',
      }),
      commit({ sha: '3' }),
    ], '2026-09-29');

    assert.deepEqual(releases.map(release => ({
      name: release.name,
      date: release.date,
      commits: release.commits.map(({ sha }) => sha),
    })), [
      {
        name: UNRELEASED,
        date: '2026-09-29',
        commits: ['1'],
      },
      {
        name: 'v7.31.9',
        date: '2026-09-18',
        commits: ['2', '3'],
      },
    ]);
  });
});

describe('assignCategories', () => {
  it('maps labels case-insensitively in config order', () => {
    const [result] = assignCategories([
      commit({ issue: pullRequest(1, 'Title', ['Bug', 'enhancement', 'other'], 'dev') }),
    ], LABELS);

    assert.deepEqual(result.categories, [':rocket: Enhancement', ':bug: Bug Fix']);
  });

  it('leaves commits without PR uncategorized', () => {
    const [result] = assignCategories([commit({})], LABELS);

    assert.deepEqual(result.categories, []);
  });
});

describe('renderRelease', () => {
  const title = '[v7.31.5](https://github.com/shopgate/pwa/compare/v7.31.4...v7.31.5)';

  it('renders like lerna-changelog', () => {
    const commits = assignCategories([
      commit({ issue: pullRequest(1482, 'Improve frontend error handling', ['enhancement'], 'AylinUenal') }),
      commit({ issue: pullRequest(1487, 'Update native modules, improve unit test and lint setup for extensions', ['internal'], 'fkloes') }),
    ], LABELS);

    const markdown = renderRelease({
      name: UNRELEASED,
      date: '2026-08-04',
      commits,
    }, Object.values(LABELS), title);

    assert.equal(markdown, [
      '## [v7.31.5](https://github.com/shopgate/pwa/compare/v7.31.4...v7.31.5) (2026-08-04)',
      '',
      '#### :rocket: Enhancement',
      '* [#1482](https://github.com/shopgate/pwa/pull/1482) Improve frontend error handling ([@AylinUenal](https://github.com/AylinUenal))',
      '',
      '#### :house: Internal',
      '* [#1487](https://github.com/shopgate/pwa/pull/1487) Update native modules, improve unit test and lint setup for extensions ([@fkloes](https://github.com/fkloes))',
    ].join('\n'));
  });

  it('links issues that a PR title closes', () => {
    const commits = assignCategories([
      commit({ issue: pullRequest(5, 'Fixes #3 in cart', ['bug'], 'dev') }),
    ], LABELS);

    assert.match(
      renderRelease({
        name: 'v7.31.4',
        date: '2026-07-17',
        commits,
      }, Object.values(LABELS), title),
      /^## v7\.31\.4 \(2026-07-17\)\n\n#### :bug: Bug Fix\n\* \[#5\]\(.+\) Closes \[#3\]\(https:\/\/github\.com\/shopgate\/pwa\/issues\/3\) in cart/
    );
  });

  it('renders nothing without categorized commits', () => {
    assert.equal(renderRelease({
      name: UNRELEASED,
      date: '2026-08-04',
      commits: [commit({})],
    }, Object.values(LABELS), title), '');
  });
});

describe('insertIntoChangelog', () => {
  const existing = '# Changelog\n\n## [v7.32.0](https://github.com/shopgate/pwa/compare/v7.31.9...v7.32.0) (2026-09-25)\n\n#### :rocket: Enhancement\n* entry\n';
  const title = '[v7.33.0](https://github.com/shopgate/pwa/compare/v7.32.0...v7.33.0)';
  const latest = `\n## ${title} (2026-10-01)\n\n#### :bug: Bug Fix\n* fix`;

  it('inserts new entries after the marker, separated by two blank lines', () => {
    assert.equal(
      insertIntoChangelog(existing, latest, title),
      `# Changelog\n\n## ${title} (2026-10-01)\n\n#### :bug: Bug Fix\n* fix\n\n\n## [v7.32.0](https://github.com/shopgate/pwa/compare/v7.31.9...v7.32.0) (2026-09-25)\n\n#### :rocket: Enhancement\n* entry\n`
    );
  });

  it('skips releases that are already in the changelog', () => {
    const updated = insertIntoChangelog(existing, latest, title);

    assert.equal(insertIntoChangelog(updated, latest, title), updated);
  });

  it('keeps the changelog without new entries', () => {
    assert.equal(insertIntoChangelog(existing, '\n', title), existing);
  });
});

describe('extractReleaseNotes', () => {
  const changelog = [
    '# Changelog',
    '',
    '## [v7.33.0](https://github.com/shopgate/pwa/compare/v7.32.0...v7.33.0) (2026-10-01)',
    '',
    '#### :bug: Bug Fix',
    '* [#1](https://github.com/shopgate/pwa/pull/1) Fix ([@a](https://github.com/a))',
    '',
    '',
    '## [v7.32.0](https://github.com/shopgate/pwa/compare/v7.31.9...v7.32.0) (2026-09-25)',
    '',
    '#### :rocket: Enhancement',
    '* [#2](https://github.com/shopgate/pwa/pull/2) Feature ([@b](https://github.com/b))',
    '',
  ].join('\n');

  it('returns the entries of the release and the compare link of its heading', () => {
    assert.equal(
      extractReleaseNotes(changelog, 'v7.33.0', 'v7.33.0'),
      '#### :bug: Bug Fix\n* [#1](https://github.com/shopgate/pwa/pull/1) Fix ([@a](https://github.com/a))'
        + '\n\n**Full Changelog**: https://github.com/shopgate/pwa/compare/v7.32.0...v7.33.0'
    );
  });

  it('ends the compare link of a pre-release at its own tag', () => {
    assert.match(
      extractReleaseNotes(changelog, 'v7.33.0', 'v7.33.0-beta.1'),
      /\*\*Full Changelog\*\*: https:\/\/github\.com\/shopgate\/pwa\/compare\/v7\.32\.0\.\.\.v7\.33\.0-beta\.1$/
    );
  });

  it('returns the last release up to the end of the file', () => {
    assert.match(extractReleaseNotes(changelog, 'v7.32.0', 'v7.32.0'), /^#### :rocket: Enhancement\n\* \[#2\]/);
  });

  it('returns only the entries when the heading links somewhere else', () => {
    assert.equal(
      extractReleaseNotes('## [v7.33.0](https://github.com/shopgate/pwa) (2026-10-01)\n\n#### :bug: Bug Fix\n* Fix\n', 'v7.33.0', 'v7.33.0'),
      '#### :bug: Bug Fix\n* Fix'
    );
  });

  it('returns an empty string for unknown releases', () => {
    assert.equal(extractReleaseNotes(changelog, 'v7.3.0', 'v7.3.0'), '');
  });
});
