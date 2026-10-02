import readline from 'node:readline/promises';
import { setTimeout } from 'node:timers/promises';
import { PUBLISHABLE_PACKAGES, ROOT, getPackageName } from '../config.ts';
import { findMissingMasterCommits } from './check.ts';
import { logStep } from '../lib/exec.ts';
import {
  approveStaged,
  findStagedVersion,
  isLoggedIn,
  isPublished,
  isReviewPending,
} from '../lib/npm.ts';
import { updatesMaster } from '../steps/stage.ts';
import type { StagedVersion } from '../lib/npm.ts';
import type { ReleaseOptions } from '../lib/options.ts';
import type { ReleaseVersion } from '../lib/version.ts';

/**
 * Asks a question on the terminal.
 * @param question The question.
 * @returns The trimmed answer.
 */
const ask = async (question: string) => {
  const prompt = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await prompt.question(question);
  prompt.close();
  return answer.trim();
};

/**
 * Waits until npm shows the versions as published, since a new version can take a moment to appear.
 * @param names The package names.
 * @param version The package version.
 * @param attempts How often to check, 10 seconds apart.
 * @returns The packages that are still not published.
 */
const waitUntilPublished = async (
  names: string[],
  version: string,
  attempts = 6
): Promise<string[]> => {
  const unpublished = names.filter(name => !isPublished(name, version));

  if (unpublished.length === 0 || attempts <= 1) {
    return unpublished;
  }

  console.log(`${unpublished.length} of ${names.length} packages are not visible on npm yet, checking again in 10 seconds`);
  await setTimeout(10000);
  return waitUntilPublished(unpublished, version, attempts - 1);
};

/**
 * Compares the release branch with master for releases that update master and asks before
 * approving when master has commits that are missing in the release.
 * @param version The version to approve.
 * @param masterUpdate Whether the release updates master.
 * @param confirm Asks the question and returns the answer.
 */
export const confirmMasterIsMerged = async (
  version: ReleaseVersion,
  masterUpdate: boolean,
  confirm = ask
) => {
  if (!masterUpdate) {
    return;
  }

  logStep(`Checking that releases/${version.name} contains master`);
  const missingCommits = await findMissingMasterCommits(`releases/${version.name}`);

  if (missingCommits > 0 && (await confirm('Approve anyway? (y/N) ')).toLowerCase() !== 'y') {
    throw new Error('Approval cancelled. Reject the staged packages with "npm stage reject" or on npmjs.com, merge master into the source branch and release again.');
  }
};

/**
 * Approves a staged package. While npm's automated review of the package is still running, npm
 * rejects the approval, so it's retried every 30 seconds for up to 10 minutes.
 * @param staged The staged package version.
 * @param otp The npm one-time password.
 * @param approve Runs "npm stage approve".
 * @param delay Milliseconds between the attempts.
 * @param attempts How often to try.
 */
export const approveAfterReview = async (
  staged: StagedVersion,
  otp: string,
  approve = approveStaged,
  delay = 30000,
  attempts = 20
): Promise<void> => {
  const { status, stderr } = await approve(staged.id, otp);

  if (status === 0) {
    return;
  }

  const name = `${staged.packageName}@${staged.version}`;

  if (!isReviewPending(stderr)) {
    throw new Error(`Approving ${name} failed. Run approve again to continue with the remaining packages.`);
  }

  if (attempts <= 1) {
    throw new Error(`npm's automated review of ${name} still isn't finished. Run approve again later to continue with the remaining packages.`);
  }

  console.log(`npm's automated review of ${name} isn't finished yet, trying again in ${delay / 1000} seconds`);
  await setTimeout(delay);
  await approveAfterReview(staged, otp, approve, delay, attempts - 1);
};

/**
 * Approves all staged packages of a version with the developer's npm 2FA. Aborts before
 * approving anything when a package is neither staged nor published.
 * @param options The release settings.
 * @param root The repository root.
 */
export const approveRelease = async (options: ReleaseOptions, root = ROOT) => {
  const { version } = options;

  if (!isLoggedIn()) {
    throw new Error('Not logged in to npm. A login lasts 12 hours, so run "npm login" right before approving and try again.');
  }

  logStep(`Looking up staged packages of ${version.version}`);

  const pending: StagedVersion[] = [];
  const missing: string[] = [];

  PUBLISHABLE_PACKAGES.forEach((pkg) => {
    const name = getPackageName(pkg.dir, root);

    if (isPublished(name, version.version)) {
      console.log(`- ${name}@${version.version} already published`);
      return;
    }

    const staged = findStagedVersion(name, version.version);

    if (staged) {
      pending.push(staged);
    } else {
      missing.push(name);
    }
  });

  if (missing.length > 0) {
    throw new Error(`Not staged: ${missing.join(', ')}. Resume the release before approving.`);
  }

  if (pending.length === 0) {
    console.log('Nothing to approve.');
    return;
  }

  console.table(pending.map(({ packageName, version: stagedVersion, tag }) => ({
    package: packageName,
    version: stagedVersion,
    tag,
  })));

  await confirmMasterIsMerged(version, updatesMaster(options, root));

  const otp = await ask('npm one-time password: ');

  logStep(`Approving ${pending.length} packages`);
  for (const staged of pending) {
    // eslint-disable-next-line no-await-in-loop
    await approveAfterReview(staged, otp);
  }

  logStep('Checking that the packages are published');
  const unpublished = await waitUntilPublished(
    pending.map(staged => staged.packageName),
    version.version
  );

  if (unpublished.length > 0) {
    throw new Error(`Not published yet: ${unpublished.join(', ')}. Check them on npmjs.com and run approve again.`);
  }

  console.log(`\n✔ ${version.version} is published. Now run the "release:finalize" job of the GitLab pipeline.`);
};
