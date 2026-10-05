import readline from 'node:readline/promises';
import { setTimeout } from 'node:timers/promises';
import { PUBLISHABLE_PACKAGES, ROOT, getPackageName } from '../config.ts';
import { findMissingMasterCommits } from './check.ts';
import { logStep } from '../lib/exec.ts';
import { notify } from '../lib/notify.ts';
import {
  color,
  endProgress,
  showResult,
  waitWithProgress,
} from '../lib/progress.ts';
import {
  approveStaged,
  findStagedVersion,
  isLoggedIn,
  isOtpRejected,
  isPublished,
  isReviewPending,
  probeApproval,
} from '../lib/npm.ts';
import { updatesMaster } from '../steps/stage.ts';
import { symbols } from '../lib/symbols.ts';
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
 * Asks for the one-time password. Users of security keys or passkeys leave it empty, so npm
 * handles the confirmation on the terminal.
 */
const OTP_QUESTION = 'npm one-time password (leave empty for a security key or passkey): ';

/**
 * Settings of approveAfterReview, replaceable in tests.
 */
interface ApproveSettings {
  /**
   * Runs "npm stage approve".
   */
  approve?: typeof approveStaged;
  /**
   * Asks for a new one-time password.
   */
  askOtp?: (question: string) => Promise<string>;
  /**
   * Milliseconds between the attempts while npm's automated review is running.
   */
  delay?: number;
  /**
   * How often to try while npm's automated review is running.
   */
  attempts?: number;
  /**
   * Time of the first attempt, to show how long the approval has been waiting.
   */
  startedAt?: number;
}

/**
 * Formats a duration like 1:05.
 * @param milliseconds The duration.
 * @returns The minutes and seconds.
 */
const formatDuration = (milliseconds: number) => {
  const seconds = Math.round(milliseconds / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};

/**
 * Approves a staged package and reports the result in one line. While npm's automated review
 * of the package is still running, npm rejects the approval, so it's retried every 30 seconds
 * for up to 10 minutes. When npm rejects the one-time password, e.g. because it expired, a new
 * one is asked for.
 * @param staged The staged package version.
 * @param otp The npm one-time password.
 * @param label Prefix of the progress line, e.g. "[3/13]".
 * @param settings Replaceable dependencies and timings.
 * @returns The one-time password that worked, for the remaining packages.
 */
export const approveAfterReview = async (
  staged: StagedVersion,
  otp: string,
  label: string,
  settings: ApproveSettings = {}
): Promise<string> => {
  const {
    approve = approveStaged,
    askOtp = ask,
    delay = 30000,
    attempts = 20,
    startedAt = Date.now(),
  } = settings;
  const name = `${staged.packageName}@${staged.version}`;
  const styledName = `${staged.packageName}${color('gray', `@${staged.version}`)}`;
  const styledLabel = color('gray', label);

  if (!otp) {
    endProgress();
  }

  const { status, stderr } = await approve(staged.id, otp);

  if (status === 0) {
    showResult(`${symbols.ok} ${styledLabel} ${styledName}`);
    return otp;
  }

  if (otp && isOtpRejected(stderr)) {
    endProgress();
    notify('PWA release', `A new npm one-time password is needed for ${name}.`, 'Ping');
    const newOtp = await askOtp(`npm rejected the one-time password, e.g. because it expired. ${OTP_QUESTION}`);
    return approveAfterReview(staged, newOtp, label, {
      ...settings,
      startedAt,
    });
  }

  if (!isReviewPending(stderr)) {
    endProgress();

    if (otp) {
      console.error(color('red', stderr.trim(), process.stderr));
    }

    throw new Error(`Approving ${name} failed. Run approve again to continue with the remaining packages.`);
  }

  if (attempts <= 1) {
    endProgress();
    throw new Error(`npm's automated review of ${name} still isn't finished. Run approve again later to continue with the remaining packages.`);
  }

  await waitWithProgress(
    delay,
    symbol => `${symbol} ${styledLabel} ${styledName}: ${color('yellow', 'waiting for npm\'s automated review')} (${formatDuration(Date.now() - startedAt)})`,
    symbols.waiting
  );
  return approveAfterReview(staged, otp, label, {
    ...settings,
    attempts: attempts - 1,
    startedAt,
  });
};

/**
 * Settings of waitForReview, replaceable in tests.
 */
interface ReviewSettings {
  /**
   * Asks npm to approve a staged package without 2FA.
   */
  probe?: typeof probeApproval;
  /**
   * Milliseconds between the checks while npm's automated review is running.
   */
  delay?: number;
  /**
   * How often to check while npm's automated review is running.
   */
  attempts?: number;
  /**
   * Time of the first check, to show how long the package has been waiting.
   */
  startedAt?: number;
}

/**
 * Result of waiting for npm's automated review of a package.
 */
interface ReviewResult {
  /**
   * Whether the package got published, which only happens when npm doesn't require 2FA.
   */
  published: boolean;
  /**
   * Whether the package had to wait for the review.
   */
  waited: boolean;
}

/**
 * Waits until npm's automated review of a staged package is finished, without a one-time
 * password: npm rejects an approval without 2FA with E409 while the review runs and asks for the
 * 2FA once it's done. Only packages that wait get a progress line.
 * @param staged The staged package version.
 * @param label Prefix of the progress line, e.g. "[3/13]".
 * @param settings Replaceable dependencies and timings.
 * @returns Whether the package got published and whether it waited.
 */
export const waitForReview = async (
  staged: StagedVersion,
  label: string,
  settings: ReviewSettings = {}
): Promise<ReviewResult> => {
  const {
    probe = probeApproval,
    delay = 30000,
    attempts = 20,
    startedAt = Date.now(),
  } = settings;
  const name = `${staged.packageName}@${staged.version}`;
  const styledName = `${staged.packageName}${color('gray', `@${staged.version}`)}`;
  const styledLabel = color('gray', label);
  const waited = settings.startedAt !== undefined;
  const { status, stderr } = await probe(staged.id);

  if (status === 0) {
    showResult(`${symbols.ok} ${styledLabel} ${styledName}`);
    return {
      published: true,
      waited,
    };
  }

  if (!isReviewPending(stderr)) {
    if (!isOtpRejected(stderr)) {
      endProgress();
      const code = /npm error code (\S+)/.exec(stderr)?.[1] ?? `exit ${status}`;
      console.warn(`${symbols.warning} ${styledLabel} ${styledName}: ${color('yellow', `couldn't check npm's review (${code}), the approval will show it`)}`);
    } else if (waited) {
      showResult(`${symbols.ok} ${styledLabel} ${styledName}: ${color('gray', `review finished after ${formatDuration(Date.now() - startedAt)}`)}`);
    }

    return {
      published: false,
      waited,
    };
  }

  if (attempts <= 1) {
    endProgress();
    throw new Error(`npm's automated review of ${name} still isn't finished. Nothing was published; run approve again later.`);
  }

  await waitWithProgress(
    delay,
    symbol => `${symbol} ${styledLabel} ${styledName}: ${color('yellow', 'waiting for npm\'s automated review')} (${formatDuration(Date.now() - startedAt)})`,
    symbols.waiting
  );
  return waitForReview(staged, label, {
    ...settings,
    attempts: attempts - 1,
    startedAt,
  });
};

/**
 * How long the approval of a package took.
 */
interface PackageDuration {
  /**
   * npm package name.
   */
  packageName: string;
  /**
   * Duration of the approval, including waits for npm's automated review and new one-time
   * passwords.
   */
  milliseconds: number;
}

/**
 * Summarizes the approval, naming the slowest package when it took noticeably long, e.g. because
 * of npm's automated review or a new one-time password.
 * @param durations The durations per package.
 * @param total The duration of the whole approval.
 * @returns The summary, e.g. "13 packages in 2:14 (slowest: @shopgate/engage, 1:30)".
 */
export const summarizeDurations = (durations: PackageDuration[], total: number) => {
  const packages = durations.length === 1 ? '1 package' : `${durations.length} packages`;
  const summary = `${packages} in ${formatDuration(total)}`;
  const slowest = durations.reduce<PackageDuration | null>(
    (current, entry) => (!current || entry.milliseconds > current.milliseconds ? entry : current),
    null
  );

  return slowest && slowest.milliseconds >= 10000
    ? `${summary} (slowest: ${slowest.packageName}, ${formatDuration(slowest.milliseconds)})`
    : summary;
};

/**
 * Settings of approvePackages, replaceable for tests and the dry run.
 */
interface ApprovalSettings {
  /**
   * Asks npm to approve a staged package without 2FA.
   */
  probe?: typeof probeApproval;
  /**
   * Runs "npm stage approve".
   */
  approve?: typeof approveStaged;
  /**
   * Asks for the one-time password.
   */
  askOtp?: (question: string) => Promise<string>;
  /**
   * Milliseconds between the checks while npm's automated review is running.
   */
  delay?: number;
}

/**
 * Approves staged packages in two phases, so nothing is public before every package passed npm's
 * automated review: first it waits for all reviews without a one-time password, then it asks for
 * the password once and approves all packages in their order within seconds.
 * @param pending The staged packages, dependencies first.
 * @param version The version to release.
 * @param settings Replaceable dependencies and timings.
 * @returns The summary of the approval, e.g. "13 packages in 2:14".
 */
export const approvePackages = async (
  pending: StagedVersion[],
  version: string,
  settings: ApprovalSettings = {}
) => {
  const {
    probe = probeApproval,
    approve = approveStaged,
    askOtp = ask,
    delay = 30000,
  } = settings;
  const label = (index: number) => `[${index + 1}/${pending.length}]`;
  const startedAt = Date.now();
  const durations = new Map(pending.map(staged => [staged.packageName, 0]));
  const addDuration = (packageName: string, since: number) => {
    durations.set(packageName, (durations.get(packageName) ?? 0) + Date.now() - since);
  };

  logStep(`Waiting for npm's automated review of ${pending.length} packages`);
  const ready: [number, StagedVersion][] = [];
  let waited = false;

  for (const [index, staged] of pending.entries()) {
    const since = Date.now();
    // eslint-disable-next-line no-await-in-loop
    const review = await waitForReview(staged, label(index), {
      probe,
      delay,
    });
    addDuration(staged.packageName, since);
    waited = waited || review.waited;

    if (!review.published) {
      ready.push([index, staged]);
    }
  }

  console.log(`${symbols.ok} All reviews are finished`);

  if (ready.length > 0) {
    if (waited) {
      notify('PWA release', `npm's review of ${version} is finished. Enter the one-time password.`, 'Ping');
    }

    let otp = await askOtp(OTP_QUESTION);

    logStep(`Approving ${ready.length} packages`);
    for (const [index, staged] of ready) {
      const since = Date.now();
      // eslint-disable-next-line no-await-in-loop
      otp = await approveAfterReview(staged, otp, label(index), {
        approve,
        askOtp,
        delay,
      });
      addDuration(staged.packageName, since);
    }
  }

  return summarizeDurations(
    [...durations].map(([packageName, milliseconds]) => ({
      packageName,
      milliseconds,
    })),
    Date.now() - startedAt
  );
};

/**
 * Shows the progress lines of an approval without approving anything. The first package waits
 * once for a simulated automated review.
 * @param pending The staged packages.
 * @param delay Milliseconds of the simulated review.
 */
export const simulateApproval = async (pending: StagedVersion[], delay = 3000) => {
  console.log(`\nDry run: simulating the approval of ${pending.length} packages, nothing is published`);
  let probes = 0;

  await approvePackages(pending, 'the dry run', {
    probe: async () => {
      probes += 1;
      return {
        status: 1,
        stderr: probes === 1
          ? 'npm error code E409\nnpm error automated review hasn\'t finished (simulated)'
          : 'npm error code EOTP',
      };
    },
    approve: async () => ({
      status: 0,
      stderr: '',
    }),
    askOtp: async () => {
      console.log('Dry run: would ask for the one-time password now');
      return 'dry-run';
    },
    delay,
  });

  console.log('\nDry run: nothing was approved.');
  notify('PWA release', 'Dry run of the approval finished.', 'Glass');
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

  if (options.dryRun) {
    await simulateApproval(pending);
    return;
  }

  let summary: string;

  try {
    summary = await approvePackages(pending, version.version);

    logStep('Checking that the packages are published');
    const unpublished = await waitUntilPublished(
      pending.map(staged => staged.packageName),
      version.version
    );

    if (unpublished.length > 0) {
      throw new Error(`Not published yet: ${unpublished.join(', ')}. Check them on npmjs.com and run approve again.`);
    }
  } catch (error) {
    notify('PWA release', `Approving ${version.version} failed.`, 'Basso');
    throw error;
  }

  console.log(`\n${symbols.ok} ${version.version} is published: ${summary}`);
  console.log('Now run the "release:finalize" job of the GitLab pipeline.');
  notify('PWA release', `${version.version} is published.`, 'Glass');
};
