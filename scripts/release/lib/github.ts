import { setTimeout } from 'node:timers/promises';
import { describeError } from './exec.ts';

/**
 * The subset of a GitHub release that the release scripts use.
 */
export interface GithubRelease {
  /**
   * GitHub release ID.
   */
  id: number;
  /**
   * Release title. The release scripts use the tag name as title.
   */
  name: string | null;
  /**
   * Tag of the release. For drafts the tag doesn't exist yet.
   */
  tag_name: string;
  /**
   * Whether the release is an unpublished draft.
   */
  draft: boolean;
}

/**
 * The subset of a GitHub issue or pull request that the changelog uses.
 */
export interface GithubIssue {
  /**
   * Issue or pull request number.
   */
  number: number;
  /**
   * Title that is shown in the changelog.
   */
  title: string;
  /**
   * Labels that decide the changelog category.
   */
  labels: Array<{ name: string }>;
  /**
   * Author that is credited in the changelog.
   */
  user: {
    login: string;
    html_url: string;
  };
  /**
   * Only set when the issue is a pull request.
   */
  pull_request?: { html_url: string };
}

/**
 * Settings for a GitHub release that is created for a released version.
 */
export interface CreateReleaseOptions {
  /**
   * Tag (and title) of the release, e.g. "v7.33.0".
   */
  tag: string;
  /**
   * Branch the tag is created on when the release gets published.
   */
  target: string;
  /**
   * Create the release as unpublished draft.
   */
  draft: boolean;
  /**
   * Mark the release as pre-release on GitHub.
   */
  prerelease: boolean;
  /**
   * Release notes in markdown.
   */
  body: string;
}

/**
 * Returns the GitHub token from GITHUB_AUTH_TOKEN (or the legacy GITHUB_AUTH).
 * @returns The token, or undefined when none is set.
 */
export const getGithubToken = () => (
  process.env.GITHUB_AUTH_TOKEN || process.env.GITHUB_AUTH || undefined
);

/**
 * Calls the GitHub REST API, authenticated with GITHUB_AUTH_TOKEN when it's set.
 * @param method The HTTP method.
 * @param pathname The API path, e.g. "/repos/shopgate/pwa/releases".
 * @param body JSON request body.
 * @returns The parsed response, or null for 404 responses.
 */
const request = async <T>(
  method: string,
  pathname: string,
  body?: unknown
): Promise<T | null> => {
  const token = getGithubToken();
  const attempts = method === 'GET' ? 3 : 1;
  let response: Response | undefined;

  for (let attempt = 1; !response; attempt += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      response = await fetch(`https://api.github.com${pathname}`, {
        method,
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (error) {
      if (attempt >= attempts) {
        throw new Error(`GitHub API ${method} ${pathname} failed`, { cause: error });
      }

      console.warn(`GitHub API ${method} ${pathname} failed (${describeError(error)}), retrying (${attempt}/${attempts - 1})`);
      // eslint-disable-next-line no-await-in-loop
      await setTimeout(attempt * 1000);
    }
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`GitHub API ${method} ${pathname} failed: ${response.status} ${await response.text()}`);
  }

  return response.json() as Promise<T>;
};

/**
 * Fetches an issue or pull request.
 * @param repo GitHub "owner/repo".
 * @param issueNumber The issue or PR number.
 * @returns The issue, or null when it doesn't exist.
 */
export const getIssue = (repo: string, issueNumber: string) => (
  request<GithubIssue>('GET', `/repos/${repo}/issues/${issueNumber}`)
);

/**
 * Returns the subjects of the latest commits on a branch.
 * @param repo GitHub "owner/repo".
 * @param branch The branch name.
 * @param count Number of commits to read.
 * @returns The commit subjects, newest first. Empty when the branch doesn't exist.
 */
export const getCommitSubjects = async (repo: string, branch: string, count = 30) => {
  const commits = await request<Array<{ commit: { message: string } }>>(
    'GET',
    `/repos/${repo}/commits?sha=${encodeURIComponent(branch)}&per_page=${count}`
  ) ?? [];

  return commits.map(({ commit }) => commit.message.split('\n')[0]);
};

/**
 * Commits that are in one branch but not in another.
 */
export interface MissingCommits {
  /**
   * Number of missing commits.
   */
  total: number;
  /**
   * Subjects of the newest missing commits (at most 250), newest first.
   */
  subjects: string[];
}

/**
 * Finds the commits that are in one branch but not in another.
 * @param repo GitHub "owner/repo".
 * @param branch The branch that might miss commits.
 * @param source The branch whose commits are expected in "branch", e.g. "master".
 * @returns The missing commits, or null when a branch doesn't exist.
 */
export const getMissingCommits = async (
  repo: string,
  branch: string,
  source: string
): Promise<MissingCommits | null> => {
  const comparison = await request<{
    ahead_by: number;
    commits: Array<{ commit: { message: string } }>;
  }>('GET', `/repos/${repo}/compare/${encodeURIComponent(branch)}...${encodeURIComponent(source)}`);

  if (!comparison) {
    return null;
  }

  return {
    total: comparison.ahead_by,
    subjects: comparison.commits.map(({ commit }) => commit.message.split('\n')[0]).reverse(),
  };
};

/**
 * Finds a release by tag or name among the latest 100 releases, including drafts.
 * @param repo GitHub "owner/repo".
 * @param tag The release tag, e.g. "v7.33.0".
 * @returns The release, or null when there is none.
 */
export const findRelease = async (repo: string, tag: string) => {
  const releases = await request<GithubRelease[]>('GET', `/repos/${repo}/releases?per_page=100`) ?? [];
  return releases.find(release => release.tag_name === tag || release.name === tag) ?? null;
};

/**
 * Creates a GitHub release. Its tag is created once the release is published.
 * @param repo GitHub "owner/repo".
 * @param options The release settings.
 * @returns The created release.
 */
export const createRelease = async (repo: string, options: CreateReleaseOptions) => {
  const release = await request<GithubRelease>('POST', `/repos/${repo}/releases`, {
    tag_name: options.tag,
    target_commitish: options.target,
    name: options.tag,
    body: options.body,
    draft: options.draft,
    prerelease: options.prerelease,
  });

  if (!release) {
    throw new Error(`Can't create the GitHub release ${options.tag} in ${repo}: the repository wasn't found or the token has no access to it.`);
  }

  return release;
};
