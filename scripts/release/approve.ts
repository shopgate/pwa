import readline from 'node:readline/promises';
import { setTimeout } from 'node:timers/promises';
import { PUBLISHABLE_PACKAGES, ROOT, getPackageName } from './config.ts';
import { findMissingMasterCommits } from './check.ts';
import { logStep } from './lib/exec.ts';
import { approveStaged, findStagedVersion, isPublished } from './lib/npm.ts';
import type { StagedVersion } from './lib/npm.ts';
import type { ReleaseVersion } from './lib/version.ts';

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
 * Approves all staged packages of a version with the developer's npm 2FA. Aborts before
 * approving anything when a package is neither staged nor published.
 * @param version The version to approve.
 * @param root The repository root.
 */
export const approveRelease = async (version: ReleaseVersion, root = ROOT) => {
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

  if (version.stable) {
    logStep(`Checking that releases/${version.name} contains master`);
    const missingCommits = await findMissingMasterCommits(`releases/${version.name}`);

    if (missingCommits > 0 && (await ask('Approve anyway? (y/N) ')).toLowerCase() !== 'y') {
      throw new Error('Approval cancelled. Reject the staged packages with "npm stage reject" or on npmjs.com, merge master into the source branch and release again.');
    }
  }

  const otp = await ask('npm one-time password: ');

  logStep(`Approving ${pending.length} packages`);
  pending.forEach(staged => approveStaged(staged.id, otp));

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
