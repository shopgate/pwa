import { spawn } from 'node:child_process';
import { capture, run } from './exec.ts';

const NPM_UNREACHABLE = 'npm may be unreachable: retry now. If https://status.npmjs.org reports an incident, retry once it is resolved.';

/**
 * A package version that is staged on npm and waits for approval.
 */
export interface StagedVersion {
  /**
   * Stage ID (UUID) that is needed to approve or reject the staged version.
   */
  id: string;
  /**
   * npm package name.
   */
  packageName: string;
  /**
   * Staged package version.
   */
  version: string;
  /**
   * dist-tag that is applied when the version gets approved.
   */
  tag?: string;
}

/**
 * Checks whether a package version is live on npm.
 * @param name The package name.
 * @param version The package version.
 * @returns Whether the version is published.
 */
export const isPublished = (name: string, version: string) => {
  const { status, stdout, stderr } = capture('npm', ['view', `${name}@${version}`, 'version'], {
    allowFailure: true,
  });

  if (status !== 0 && !stderr.includes('E404')) {
    throw new Error(`npm view ${name}@${version} failed:\n${stderr.trim()}\n${NPM_UNREACHABLE}`);
  }

  return stdout.trim() !== '';
};

/**
 * Returns the version a dist-tag currently points to.
 * @param name The package name.
 * @param tag The dist-tag, e.g. "latest".
 * @returns The version, or an empty string when the tag doesn't exist.
 */
export const getDistTagVersion = (name: string, tag: string) => {
  const { status, stdout, stderr } = capture('npm', ['view', name, `dist-tags.${tag}`], {
    allowFailure: true,
  });

  if (status !== 0 && !stderr.includes('E404')) {
    throw new Error(`npm view ${name} dist-tags.${tag} failed:\n${stderr.trim()}\n${NPM_UNREACHABLE}`);
  }

  return stdout.trim();
};

/**
 * Lists all staged versions of a package. Needs npm authentication.
 * @param name The package name.
 * @returns The staged versions.
 */
export const listStagedVersions = (name: string): StagedVersion[] => {
  const { stdout } = capture('npm', ['stage', 'list', name, '--json']);
  return JSON.parse(stdout || '[]') as StagedVersion[];
};

/**
 * Finds the staged entry of a package version.
 * @param name The package name.
 * @param version The package version.
 * @returns The staged version, or undefined when it isn't staged.
 */
export const findStagedVersion = (name: string, version: string) => (
  listStagedVersions(name).find(staged => staged.version === version)
);

/**
 * Stages a package directory on npm. It only becomes public after approval.
 * @param dir Directory with the package.json to publish.
 * @param tag dist-tag that is applied on approval.
 * @param dryRun Only pack the package without staging it.
 */
export const stagePublish = (dir: string, tag: string, dryRun: boolean) => {
  run('npm', [
    'stage',
    'publish',
    dir,
    '--access',
    'public',
    '--tag',
    tag,
    ...(dryRun ? ['--dry-run'] : ['--loglevel', 'warn']),
  ]);
};

/**
 * Result of an approval attempt.
 */
export interface ApproveResult {
  /**
   * Exit status of "npm stage approve". 0 means the package is published.
   */
  status: number;
  /**
   * Error output of npm.
   */
  stderr: string;
}

/**
 * Checks whether npm accepts the current login. Logins via "npm login" last 12 hours.
 * @returns Whether npm knows the user.
 */
export const isLoggedIn = () => capture('npm', ['whoami'], { allowFailure: true }).status === 0;

/**
 * Approves (publishes) a staged package. With a one-time password, npm's output is collected
 * instead of shown, so the caller can report the result in one line; sfw --verbose npm then can't ask for a new
 * password itself and fails with EOTP. Without one, npm runs on the terminal and handles the 2FA
 * itself, e.g. the browser confirmation of a security key or passkey.
 * @param id The stage ID.
 * @param otp The npm one-time password. Empty to let npm handle the 2FA on the terminal.
 * @returns The exit status and the error output.
 */
export const approveStaged = (id: string, otp: string): Promise<ApproveResult> => (
  new Promise((resolve, reject) => {
    const child = spawn('npm', ['stage', 'approve', id, '--loglevel', 'warn'], {
      env: {
        ...process.env,
        ...(otp ? { npm_config_otp: otp } : {}),
      },
      stdio: otp ? ['ignore', 'ignore', 'pipe'] : ['inherit', 'inherit', 'pipe'],
    });
    let stderr = '';

    child.stderr.on('data', (chunk: Buffer) => {
      if (!otp) {
        process.stderr.write(chunk);
      }
      stderr += chunk.toString();
    });
    child.on('error', reject);
    child.on('close', status => resolve({
      status: status ?? 1,
      stderr,
    }));
  })
);

/**
 * Whether npm rejected an approval because its automated review of the package isn't done yet.
 * @param stderr The error output of "npm stage approve".
 * @returns Whether the approval can be retried later.
 */
export const isReviewPending = (stderr: string) => (
  stderr.includes('E409') && /automated review/i.test(stderr)
);

/**
 * Whether npm rejected an approval because the one-time password is missing, wrong or expired.
 * @param stderr The error output of "npm stage approve".
 * @returns Whether the approval can be repeated with a new one-time password.
 */
export const isOtpRejected = (stderr: string) => (
  /\bEOTP\b/.test(stderr) || (/\bE401\b/.test(stderr) && /one-time pass/i.test(stderr))
);
