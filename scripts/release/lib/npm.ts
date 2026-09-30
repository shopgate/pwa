import { capture, run } from './exec.ts';

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
    throw new Error(`npm view ${name}@${version} failed:\n${stderr.trim()}`);
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
    throw new Error(`npm view ${name} dist-tags.${tag} failed:\n${stderr.trim()}`);
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
 * Approves (publishes) a staged package. npm asks for a new OTP when the given one expired.
 * @param id The stage ID.
 * @param otp The npm one-time password. Empty to let npm ask for it.
 */
export const approveStaged = (id: string, otp: string) => {
  run('npm', ['stage', 'approve', id], otp ? { env: { npm_config_otp: otp } } : {});
};
