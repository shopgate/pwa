import {
  GITHUB_REPO,
  PUBLISHABLE_PACKAGES,
  ROOT,
  getPackageName,
  getThemes,
} from './config.ts';
import { logStep } from './lib/exec.ts';
import { remoteBranchExists, remoteTagExists } from './lib/git.ts';
import {
  findRelease,
  getCommitSubjects,
  getGithubToken,
  getMissingCommits,
} from './lib/github.ts';
import { findStagedVersion, getDistTagVersion, isPublished } from './lib/npm.ts';
import type { ReleaseOptions } from './lib/options.ts';
import { compareVersions, isValidVersion, parseVersion } from './lib/version.ts';
import type { ReleaseVersion } from './lib/version.ts';

/**
 * A place where the requested version already exists.
 */
export interface TakenLocation {
  /**
   * Where the version exists, e.g. "npm @shopgate/engage@7.33.0" or "shopgate/pwa tag v7.33.0".
   */
  location: string;
  /**
   * State at that location, e.g. "published", "staged", "draft" or "exists".
   */
  detail: string;
}

/**
 * Collects every npm package, git ref and GitHub release that already uses the version.
 * @param version The version to release.
 * @param root The repository root.
 * @returns The taken locations. Empty when the version is available.
 */
export const findTakenLocations = async (version: ReleaseVersion, root = ROOT) => {
  const taken: TakenLocation[] = [];

  PUBLISHABLE_PACKAGES.forEach((pkg) => {
    const name = getPackageName(pkg.dir, root);
    const location = `npm ${name}@${version.version}`;

    if (isPublished(name, version.version)) {
      taken.push({
        location,
        detail: 'published',
      });
    } else if (findStagedVersion(name, version.version)) {
      taken.push({
        location,
        detail: 'staged',
      });
    }
  });

  const repos = [
    {
      githubRepo: GITHUB_REPO,
      remote: 'origin',
    },
    ...getThemes(root).map(theme => ({
      githubRepo: theme.githubRepo,
      remote: theme.gitUrl,
    })),
  ];

  for (const { githubRepo, remote } of repos) {
    if (remoteTagExists(remote, version.name)) {
      taken.push({
        location: `${githubRepo} tag ${version.name}`,
        detail: 'exists',
      });
    }

    [`releases/${version.name}`, version.name]
      .filter(branch => remoteBranchExists(remote, branch))
      .forEach(branch => taken.push({
        location: `${githubRepo} branch ${branch}`,
        detail: 'exists',
      }));

    // eslint-disable-next-line no-await-in-loop
    const release = await findRelease(githubRepo, version.name);
    if (release) {
      taken.push({
        location: `${githubRepo} GitHub release ${version.name}`,
        detail: release.draft ? 'draft' : 'exists',
      });
    }
  }

  return taken;
};

/**
 * Warns when the version isn't higher than the one its dist-tag currently points to.
 * @param version The version to release.
 * @param root The repository root.
 */
const warnAboutOlderVersion = (version: ReleaseVersion, root = ROOT) => {
  const packageName = getPackageName(PUBLISHABLE_PACKAGES[0].dir, root);
  const current = getDistTagVersion(packageName, version.distTag);

  if (isValidVersion(current) && compareVersions(version, parseVersion(current)) <= 0) {
    console.warn(`⚠ ${version.version} is not higher than the current "${version.distTag}" version ${current}.`);
  }
};

/**
 * Prints the master commits that a branch doesn't contain.
 * @param branch The branch to compare with master.
 * @returns The number of missing commits.
 */
export const findMissingMasterCommits = async (branch: string) => {
  const missing = await getMissingCommits(GITHUB_REPO, branch, 'master');

  if (missing === null) {
    throw new Error(`Can't compare ${branch} with master: the branch doesn't exist on GitHub.`);
  }

  if (missing.total > 0) {
    console.warn(`⚠ master has ${missing.total} commits that aren't in ${branch}:`);
    missing.subjects.slice(0, 10).forEach(subject => console.warn(`  - ${subject}`));

    if (missing.total > 10) {
      console.warn(`  … and ${missing.total - 10} more`);
    }
  }

  return missing.total;
};

/**
 * Fails for stable releases that update master when the source branch misses commits from
 * master, since the release would drop them and the master merge in finalize could conflict.
 * Other releases only get a warning.
 * @param options The release settings.
 */
export const checkMasterIsMerged = async (options: ReleaseOptions) => {
  const { version, branch, updateMaster } = options;

  if (!branch) {
    return;
  }

  logStep(`Checking that ${branch} contains master`);
  const missing = await findMissingMasterCommits(branch);

  if (missing === 0) {
    console.log(`✔ ${branch} contains all commits of master`);
  } else if (version.stable && updateMaster) {
    throw new Error(`Merge master into ${branch} before releasing ${version.version}.`);
  }
};

/**
 * Fails when the version is already (partially) released, unless "resume" is set and the
 * release branch proves that it's an interrupted run of this release.
 * @param options The release settings.
 * @param root The repository root.
 */
export const checkVersion = async (options: ReleaseOptions, root = ROOT) => {
  const { version, resume } = options;

  if (process.env.CI === 'true' && !getGithubToken()) {
    throw new Error('GITHUB_AUTH_TOKEN is not set. It is needed to create the GitHub releases in finalize.');
  }

  await checkMasterIsMerged(options);

  logStep(`Checking availability of ${version.version}`);
  warnAboutOlderVersion(version, root);

  const taken = await findTakenLocations(version, root);

  if (taken.length === 0) {
    console.log(`✔ ${version.version} is available`);
    return;
  }

  console.table(taken);

  if (!resume) {
    throw new Error(`${version.version} is already taken. Set RESUME=true (or --resume) to continue an interrupted release.`);
  }

  const subjects = await getCommitSubjects(GITHUB_REPO, `releases/${version.name}`);

  if (!subjects.includes(`Released ${version.version}`)) {
    throw new Error(`Can't resume: releases/${version.name} doesn't contain the "Released ${version.version}" commit.`);
  }

  console.log(`✔ Resuming the interrupted release of ${version.version}`);
};
