import fs from 'node:fs';
import path from 'node:path';
import { GITHUB_REPO, ROOT, getThemes } from '../config.ts';
import { gitOutput } from '../lib/git.ts';
import { getIssue } from '../lib/github.ts';
import type { GithubIssue } from '../lib/github.ts';
import { compareVersions, isValidVersion, parseVersion } from '../lib/version.ts';
import type { ReleaseVersion } from '../lib/version.ts';

export const UNRELEASED = '___unreleased___';
const MARKER = '# Changelog\n';
const COMMIT_FIX_REGEX = /(fix|close|resolve)(e?s|e?d)? [T#](\d+)/i;
const SEPARATOR = '\x1f';
const ISSUE_REQUEST_CONCURRENCY = 5;

/**
 * A commit between the previous release tag and HEAD.
 */
export interface CommitInfo {
  /**
   * Abbreviated commit hash.
   */
  sha: string;
  /**
   * First line of the commit message.
   */
  summary: string;
  /**
   * Commit date as YYYY-MM-DD.
   */
  date: string;
  /**
   * Stable release tags on this commit. Pre-release tags are left out.
   */
  tags: string[];
  /**
   * PR number from a merge or squash commit subject. null for other commits.
   */
  issueNumber: string | null;
  /**
   * PR data from GitHub. Unset until loaded, null if the PR doesn't exist.
   */
  issue?: GithubIssue | null;
  /**
   * Changelog categories derived from the PR labels. Commits without category don't show up.
   */
  categories: string[];
}

/**
 * The commits that belong to one released (or not yet released) version.
 */
export interface Release {
  /**
   * Tag name of the release, or UNRELEASED for commits after the last tag.
   */
  name: string;
  /**
   * Release date as YYYY-MM-DD. Today for unreleased commits.
   */
  date: string;
  /**
   * Commits of the release, newest first.
   */
  commits: CommitInfo[];
}

/**
 * Returns the tag prefix of the previous release line, e.g. "v7.32." for 7.32.1,
 * "v7.31." for 7.32.0 and "v6." for 7.0.0.
 * @param version The version to release.
 * @returns The tag prefix.
 */
export const getPreviousTagPrefix = (version: ReleaseVersion) => {
  let { major, minor } = version;

  if (version.patch === 0) {
    minor -= 1;
  }

  if (minor < 0) {
    major = Math.max(major - 1, 0);
    return `v${major}.`;
  }

  return `v${major}.${minor}.`;
};

/**
 * Returns the highest stable tag with the given prefix that is lower than the released version.
 * @param tags All tag names.
 * @param prefix The tag prefix.
 * @param version The version to release. Its own tag and higher ones are ignored.
 * @returns The tag, or null when there is none.
 */
export const findPreviousTag = (tags: string[], prefix: string, version: ReleaseVersion) => (
  tags
    .filter(tag => tag.startsWith(prefix) && !tag.includes('-') && isValidVersion(tag))
    .filter(tag => compareVersions(parseVersion(tag), version) < 0)
    .sort((a, b) => compareVersions(parseVersion(a), parseVersion(b)))
    .pop() ?? null
);

/**
 * Extracts the PR number from a merge or squash commit subject.
 * @param summary The commit subject.
 * @returns The PR number, or null.
 */
export const findPullRequestId = (summary: string) => {
  const match = /^Merge pull request #(\d+) from /.exec(summary)
    ?? /\(#(\d+)\)$/.exec(summary)
    ?? /^Auto merge of #(\d+) - /.exec(summary);

  return match ? match[1] : null;
};

/**
 * Parses git log output into commits with their stable tags and PR numbers.
 * @param log Output of "git log" with the fields separated by SEPARATOR.
 * @returns The commits, newest first.
 */
export const parseCommits = (log: string): CommitInfo[] => (
  log.split('\n').filter(Boolean).map((line) => {
    const [sha, refs, summary, date] = line.split(SEPARATOR);
    const tags = refs
      .split(', ')
      .filter(ref => ref.startsWith('tag: '))
      .map(ref => ref.slice('tag: '.length))
      .filter(tag => !tag.includes('-'));

    return {
      sha,
      summary,
      date,
      tags,
      issueNumber: findPullRequestId(summary),
      categories: [],
    };
  })
);

/**
 * Groups commits by the stable tag they belong to. Commits after the latest tag are UNRELEASED.
 * @param commits The commits, newest first.
 * @param today Date for the unreleased commits as YYYY-MM-DD.
 * @returns The releases, newest first.
 */
export const groupByRelease = (commits: CommitInfo[], today: string): Release[] => {
  const releases = new Map<string, Release>();
  let currentTags = [UNRELEASED];

  commits.forEach((commit) => {
    if (commit.tags.length > 0) {
      currentTags = commit.tags;
    }

    currentTags.forEach((tag) => {
      if (!releases.has(tag)) {
        releases.set(tag, {
          name: tag,
          date: tag === UNRELEASED ? today : commit.date,
          commits: [],
        });
      }
      releases.get(tag)?.commits.push(commit);
    });
  });

  return [...releases.values()];
};

/**
 * Maps the PR labels of each commit to changelog categories.
 * @param commits The commits with loaded PR data.
 * @param labels Label to category mapping from package.json "changelog.labels".
 * @returns The commits with categories.
 */
export const assignCategories = (
  commits: CommitInfo[],
  labels: Record<string, string>
): CommitInfo[] => commits.map((commit) => {
  const issueLabels = (commit.issue?.labels ?? []).map(label => label.name.toLowerCase());

  return {
    ...commit,
    categories: Object.keys(labels)
      .filter(label => issueLabels.includes(label.toLowerCase()))
      .map(label => labels[label]),
  };
});

/**
 * Renders one changelog line with PR link, title and author.
 * @param commit The commit.
 * @returns The Markdown line without bullet, or null without PR data.
 */
const renderContribution = (commit: CommitInfo) => {
  const { issue } = commit;

  if (!issue) {
    return null;
  }

  const link = issue.number && issue.pull_request?.html_url
    ? `[#${issue.number}](${issue.pull_request.html_url}) `
    : '';
  const title = issue.title.replace(
    COMMIT_FIX_REGEX,
    `Closes [#$3](https://github.com/${GITHUB_REPO}/issues/$3)`
  );

  return `${link}${title} ([@${issue.user.login}](${issue.user.html_url}))`;
};

/**
 * Renders the Markdown section of one release.
 * @param release The release.
 * @param categories Category names in output order.
 * @param unreleasedTitle Heading title for the UNRELEASED release.
 * @returns The Markdown, or an empty string when no commit has a category.
 */
export const renderRelease = (
  release: Release,
  categories: string[],
  unreleasedTitle: string
) => {
  const sections = categories
    .map(name => ({
      name,
      commits: release.commits.filter(commit => commit.categories.includes(name)),
    }))
    .filter(section => section.commits.length > 0);

  if (sections.length === 0) {
    return '';
  }

  const title = release.name === UNRELEASED ? unreleasedTitle : release.name;

  return sections.reduce((markdown, section) => {
    const list = section.commits
      .map(renderContribution)
      .filter(Boolean)
      .map(entry => `* ${entry}`)
      .join('\n');

    return `${markdown}\n\n#### ${section.name}\n${list}`;
  }, `## ${title} (${release.date})`);
};

/**
 * Inserts new entries after the "# Changelog" marker, unless the release title already exists.
 * @param content The current changelog.
 * @param latestChanges The rendered new entries.
 * @param title The title of the new release heading.
 * @returns The updated changelog.
 */
export const insertIntoChangelog = (content: string, latestChanges: string, title: string) => {
  const current = content.trimEnd();

  if (current.includes(title) || latestChanges.trim() === '') {
    return `${current}\n`;
  }

  return `${current.replace(MARKER, `${MARKER}\n${latestChanges.trim()}\n\n`)}\n`;
};

/**
 * Returns the changelog entries of a release, followed by the compare link of its heading.
 * @param content The changelog.
 * @param baseName The release name without pre-release suffix, e.g. "v7.33.0".
 * @param tag The tag of the release, e.g. "v7.33.0-beta.1". The compare link ends there.
 * @returns The release notes, or an empty string when the release has no heading.
 */
export const extractReleaseNotes = (content: string, baseName: string, tag: string) => {
  const sections = content.split(/^(?=## )/m);
  const section = sections.find(part => part.startsWith(`## [${baseName}](`));

  if (!section) {
    return '';
  }

  const heading = section.slice(0, section.indexOf('\n'));
  const entries = section.slice(heading.length + 1).trim();
  const compareUrl = heading.match(/^## \[[^\]]+\]\((\S+)\)/)?.[1];

  if (!compareUrl?.endsWith(`...${baseName}`)) {
    return entries;
  }

  return `${entries}\n\n**Full Changelog**: ${compareUrl.slice(0, -baseName.length)}${tag}`;
};

/**
 * Loads the GitHub PR data of all commits, a few requests at a time.
 * @param commits The commits.
 * @returns The commits with PR data.
 */
const fetchIssues = async (commits: CommitInfo[]) => {
  const result: CommitInfo[] = [];

  for (let i = 0; i < commits.length; i += ISSUE_REQUEST_CONCURRENCY) {
    // eslint-disable-next-line no-await-in-loop
    const chunk = await Promise.all(commits
      .slice(i, i + ISSUE_REQUEST_CONCURRENCY)
      .map(async commit => ({
        ...commit,
        issue: commit.issueNumber ? await getIssue(GITHUB_REPO, commit.issueNumber) : null,
      })));
    result.push(...chunk);
  }

  return result;
};

/**
 * Renders the changelog entries of a release from the commits since the previous stable tag.
 * @param version The version to release.
 * @param root The repository root.
 * @returns The heading title, the rendered entries and whether the changelog already contains the
 * release (then the entries are empty).
 */
export const renderChangelog = async (version: ReleaseVersion, root = ROOT) => {
  const tags = gitOutput(['tag'], { cwd: root }).split('\n');
  const previousTag = findPreviousTag(tags, getPreviousTagPrefix(version), version)
    ?? findPreviousTag(tags, 'v', version);

  if (!previousTag) {
    // Only happens in clones without tags (--no-tags or shallow), since the fallback accepts any
    // lower stable tag. The full clone in CI always has them.
    throw new Error(`No previous stable tag found for ${version.name}. The changelog needs the release tags: run "git fetch --tags" and try again.`);
  }

  const compareUrl = `https://github.com/${GITHUB_REPO}/compare/${previousTag}...${version.baseName}`;
  const title = `[${version.baseName}](${compareUrl})`;
  const changelogFile = path.join(root, 'CHANGELOG.md');
  const content = fs.existsSync(changelogFile) ? fs.readFileSync(changelogFile, 'utf8') : '';

  if (content.includes(title)) {
    return {
      title,
      latestChanges: '',
      exists: true,
    };
  }

  const log = gitOutput([
    'log',
    `--pretty=%h${SEPARATOR}%D${SEPARATOR}%s${SEPARATOR}%cd`,
    '--date=short',
    `${previousTag}..HEAD`,
  ], { cwd: root });

  const { changelog: { labels } } = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const categories = Object.values<string>(labels);
  const minimum = parseVersion(previousTag);
  const commits = assignCategories(await fetchIssues(parseCommits(log)), labels);

  const latestChanges = groupByRelease(commits, new Date().toISOString().slice(0, 10))
    .filter(release => release.name === UNRELEASED || (
      isValidVersion(release.name)
      && compareVersions(parseVersion(release.name), minimum) >= 0
    ))
    .map(release => renderRelease(release, categories, title))
    .filter(Boolean)
    .join('\n\n\n');

  return {
    title,
    latestChanges,
    exists: false,
  };
};

/**
 * Adds the entries of a release to CHANGELOG.md and copies it to the themes.
 * @param version The version to release.
 * @param root The repository root.
 * @returns Whether CHANGELOG.md changed.
 */
export const generateChangelog = async (version: ReleaseVersion, root = ROOT) => {
  const changelogFile = path.join(root, 'CHANGELOG.md');
  const content = fs.existsSync(changelogFile) ? fs.readFileSync(changelogFile, 'utf8') : '';
  const { title, latestChanges, exists } = await renderChangelog(version, root);
  const updated = insertIntoChangelog(content, latestChanges, title);

  if (exists) {
    console.log(`CHANGELOG.md already contains ${version.baseName}.`);
  } else if (!latestChanges) {
    console.log('No labeled pull requests since the previous stable version, CHANGELOG.md is unchanged.');
  } else {
    console.log(`Added the changelog entry for ${version.baseName}.`);
  }

  fs.writeFileSync(changelogFile, updated);
  getThemes(root).forEach((theme) => {
    fs.copyFileSync(changelogFile, path.join(root, theme.dir, 'CHANGELOG.md'));
  });

  return updated !== content;
};
