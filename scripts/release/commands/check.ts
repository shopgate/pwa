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
import { mapWithLimit } from '../lib/concurrency.ts';
import { getDistTagVersion, isPublishedAsync } from '../lib/npm.ts';
import { updatesMaster } from '../steps/publish.ts';
import { symbols } from '../lib/symbols.ts';
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
   * State at that location, e.g. "published", "draft" or "exists".
   */
  detail: string;
}

/**
 * Looks up whether a package version is published on npm.
 * @param name The package name.
 * @param version The package version.
 * @returns "published", or null when npm doesn't know the version.
 */
const findNpmState = async (name: string, version: string) => (
  await isPublishedAsync(name, version) ? 'published' : null
);

/**
 * Collects the packages whose version is already published on npm. The lookups run in
 * parallel, but at most six at a time to stay far below npm's rate limits.
 * @param names The package names.
 * @param version The version to release.
 * @param lookup Looks up the npm state of a package version.
 * @returns The taken packages in the order of the names.
 */
export const findTakenPackages = async (
  names: string[],
  version: string,
  lookup = findNpmState
): Promise<TakenLocation[]> => {
  const states = await mapWithLimit(names, 6, name => lookup(name, version));

  return names.flatMap((name, index) => {
    const state = states[index];
    return state ? [{
      location: `npm ${name}@${version}`,
      detail: state,
    }] : [];
  });
};

/**
 * Collects every npm package, git ref and GitHub release that already uses the version.
 * @param version The version to release.
 * @param root The repository root.
 * @returns The taken locations. Empty when the version is available.
 */
export const findTakenLocations = async (version: ReleaseVersion, root = ROOT) => {
  const taken = await findTakenPackages(
    PUBLISHABLE_PACKAGES.map(pkg => getPackageName(pkg.dir, root)),
    version.version
  );

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
    console.warn(`${symbols.warning} ${version.version} is not higher than the current "${tag}" version ${current}.`);

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
    throw new Error(`Can't compare ${branch} with master: the branch doesn't exist on GitHub. Check the branch input or push the branch, then start a new pipeline.`);
  }

  if (missing.total > 0) {
    console.warn(`${symbols.warning} master has ${missing.total} commits that aren't in ${branch}:`);
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
    console.log(`${symbols.ok} ${branch} contains all commits of master`);
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
    throw new Error('GITHUB_AUTH_TOKEN is not set. It is needed to create the GitHub releases or tags in finalize. Add it to the CI/CD variables of pwa-liveupdate, then retry the job.');
  }

  const masterUpdate = updatesMaster(options, root);
  console.log(masterUpdate
    ? `${symbols.ok} finalize updates master, since ${version.version} becomes "latest"`
    : `${symbols.ok} finalize doesn't update master${options.skipMasterUpdate ? ' (SKIP_MASTER_UPDATE)' : `, since ${version.version} doesn't become "latest"`}`);

  await checkMasterIsMerged(options, masterUpdate);

  logStep(`Checking availability of ${version.version}`);
  warnAboutOlderVersion(version, root);

  const taken = await findTakenLocations(version, root);

  if (taken.length === 0) {
    console.log(`${symbols.ok} ${version.version} is available`);
    return;
  }

  console.table(taken);

  const messages = await getCommitMessages(GITHUB_REPO, `releases/${version.name}`);
  const continuation = getContinuation(messages, version, resume, process.env.CI_PIPELINE_ID);

  if (continuation === 'retry') {
    console.log(`${symbols.ok} Continuing the release of ${version.version} started in this pipeline`);
    return;
  }

  if (continuation === 'resume') {
    console.log(`${symbols.ok} Resuming the interrupted release of ${version.version}`);
    return;
  }

  if (resume) {
    throw new Error(`Can't resume: releases/${version.name} doesn't contain the "Released ${version.version}" commit, so the places listed above don't belong to an interrupted run of this release. Check the version. If it's really taken, release the next one. Leftovers of an aborted attempt are removed as described in "Aborting a release" of scripts/release/README.md.`);
  }

  throw new Error(`${version.version} is already taken. To continue an interrupted release in a new pipeline, set RESUME=true (or --resume).`);
};
