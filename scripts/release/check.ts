import {
  GITHUB_REPO,
  PUBLISHABLE_PACKAGES,
  ROOT,
  getPackageName,
  getThemes,
} from './config.ts';
import { logStep } from './lib/exec.ts';
import { remoteBranchExists, remoteTagExists } from './lib/git.ts';
import { findRelease, getCommitSubjects } from './lib/github.ts';
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
 * Fails when the version is already (partially) released, unless "resume" is set and the
 * release branch proves that it's an interrupted run of this release.
 * @param options The release settings.
 * @param root The repository root.
 */
export const checkVersion = async (options: ReleaseOptions, root = ROOT) => {
  const { version, resume } = options;
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
