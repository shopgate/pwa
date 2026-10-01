import {
  GITHUB_REPO,
  PUBLISHABLE_PACKAGES,
  ROOT,
  getPackageName,
  getThemes,
} from '../config.ts';
import { logStep } from '../lib/exec.ts';
import { remoteBranchExists, remoteTagExists } from '../lib/git.ts';
import {
  findRelease,
  getCommitMessages,
  getGithubToken,
  getMissingCommits,
} from '../lib/github.ts';
import { findStagedVersion, getDistTagVersion, isPublished } from '../lib/npm.ts';
import { updatesMaster } from '../steps/stage.ts';
import type { ReleaseOptions } from '../lib/options.ts';
import {
  compareVersions,
  getDistTag,
  isValidVersion,
  parseVersion,
} from '../lib/version.ts';
import type { ReleaseVersion } from '../lib/version.ts';

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
 * Warns when the version isn't higher than the one its dist-tag currently points to. For patches of
 * an older release line, it also tells that "latest" stays unchanged.
 * @param version The version to release.
 * @param root The repository root.
 */
const warnAboutOlderVersion = (version: ReleaseVersion, root = ROOT) => {
  const packageName = getPackageName(PUBLISHABLE_PACKAGES[0].dir, root);
  const tag = version.stable ? 'latest' : 'beta';
  const current = getDistTagVersion(packageName, tag);

  if (isValidVersion(current) && compareVersions(version, parseVersion(current)) <= 0) {
    console.warn(`⚠ ${version.version} is not higher than the current "${tag}" version ${current}.`);

    if (version.stable) {
      console.warn(`  It gets the dist-tag "${getDistTag(version, current)}", so "latest" and the latest GitHub releases stay unchanged.`);
    }
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
 * Fails for releases that update master when the source branch misses commits from master,
 * since the release would drop them and the master merge in finalize could conflict.
 * Other releases only get a warning.
 * @param options The release settings.
 * @param masterUpdate Whether the release updates master.
 */
export const checkMasterIsMerged = async (options: ReleaseOptions, masterUpdate: boolean) => {
  const { version, branch } = options;

  if (!branch) {
    return;
  }

  logStep(`Checking that ${branch} contains master`);
  const missing = await findMissingMasterCommits(branch);

  if (missing === 0) {
    console.log(`✔ ${branch} contains all commits of master`);
  } else if (masterUpdate) {
    throw new Error(`Merge master into ${branch} before releasing ${version.version}. Revert unwanted commits on master first. Then retry the job or start a new pipeline.`);
  }
};

/**
 * Returns the line of the "Released X" commit message that names the pipeline which created it.
 * @param pipelineId The GitLab pipeline ID.
 * @returns The line.
 */
export const pipelineLine = (pipelineId: string) => `Pipeline: ${pipelineId}`;

/**
 * Decides whether a taken version may be continued, based on the commits of its release branch.
 * @param messages The commit messages of releases/vX, newest first.
 * @param version The version to release.
 * @param resume Whether RESUME is set.
 * @param pipelineId The ID of the current GitLab pipeline, if any.
 * @returns "retry" for a job retried in the pipeline that created the release commit, "resume"
 * for an allowed RESUME, otherwise null.
 */
export const getContinuation = (
  messages: string[],
  version: ReleaseVersion,
  resume: boolean,
  pipelineId?: string
) => {
  const releaseCommit = messages.find(message => message.split('\n')[0] === `Released ${version.version}`);

  if (!releaseCommit) {
    return null;
  }

  if (pipelineId && releaseCommit.split('\n').includes(pipelineLine(pipelineId))) {
    return 'retry';
  }

  return resume ? 'resume' : null;
};

/**
 * Fails when the version is already (partially) released, unless the release branch proves that
 * it's an interrupted run of this release: either a job retried in the same pipeline or RESUME.
 * @param options The release settings.
 * @param root The repository root.
 */
export const checkVersion = async (options: ReleaseOptions, root = ROOT) => {
  const { version, resume } = options;

  if (process.env.CI === 'true' && !getGithubToken()) {
    throw new Error('GITHUB_AUTH_TOKEN is not set. It is needed to create the GitHub releases in finalize.');
  }

  const masterUpdate = updatesMaster(options, root);
  console.log(masterUpdate
    ? `✔ finalize updates master, since ${version.version} becomes "latest"`
    : `✔ finalize doesn't update master${options.skipMasterUpdate ? ' (SKIP_MASTER_UPDATE)' : `, since ${version.version} doesn't become "latest"`}`);

  await checkMasterIsMerged(options, masterUpdate);

  logStep(`Checking availability of ${version.version}`);
  warnAboutOlderVersion(version, root);

  const taken = await findTakenLocations(version, root);

  if (taken.length === 0) {
    console.log(`✔ ${version.version} is available`);
    return;
  }

  console.table(taken);

  const messages = await getCommitMessages(GITHUB_REPO, `releases/${version.name}`);
  const continuation = getContinuation(messages, version, resume, process.env.CI_PIPELINE_ID);

  if (continuation === 'retry') {
    console.log(`✔ Continuing the release of ${version.version} started in this pipeline`);
    return;
  }

  if (continuation === 'resume') {
    console.log(`✔ Resuming the interrupted release of ${version.version}`);
    return;
  }

  if (resume) {
    throw new Error(`Can't resume: releases/${version.name} doesn't contain the "Released ${version.version}" commit.`);
  }

  throw new Error(`${version.version} is already taken. To continue an interrupted release in a new pipeline, set RESUME=true (or --resume).`);
};
