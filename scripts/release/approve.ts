import readline from 'node:readline/promises';
import { PUBLISHABLE_PACKAGES, ROOT, getPackageName } from './config.ts';
import { logStep } from './lib/exec.ts';
import { approveStaged, findStagedVersion, isPublished } from './lib/npm.ts';
import type { StagedVersion } from './lib/npm.ts';
import type { ReleaseVersion } from './lib/version.ts';

/**
 * Asks for the npm one-time password on the terminal.
 * @returns The entered password.
 */
const askForOtp = async () => {
  const prompt = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const otp = await prompt.question('npm one-time password: ');
  prompt.close();
  return otp.trim();
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

  const otp = await askForOtp();

  logStep(`Approving ${pending.length} packages`);
  pending.forEach(staged => approveStaged(staged.id, otp));

  console.log(`\n✔ ${version.version} is published. Now run the "release:finalize" job of the GitLab pipeline.`);
};
