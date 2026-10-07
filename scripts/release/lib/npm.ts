import { capture, captureAsync, run } from './exec.ts';
import type { CaptureResult } from './exec.ts';

const NPM_UNREACHABLE = 'npm may be unreachable: retry now. If https://status.npmjs.org reports an incident, retry once it is resolved.';

/**
 * Interprets the output of "npm view <name>@<version> version".
 * @param name The package name.
 * @param version The package version.
 * @param result The exit status and output of npm.
 * @returns Whether the version is published.
 */
const toPublished = (name: string, version: string, result: CaptureResult) => {
  const { status, stdout, stderr } = result;

  if (status !== 0 && !stderr.includes('E404')) {
    throw new Error(`npm view ${name}@${version} failed:\n${stderr.trim()}\n${NPM_UNREACHABLE}`);
  }

  return stdout.trim() !== '';
};

/**
 * Checks whether a package version is live on npm.
 * @param name The package name.
 * @param version The package version.
 * @returns Whether the version is published.
 */
export const isPublished = (name: string, version: string) => toPublished(
  name,
  version,
  capture('npm', ['view', `${name}@${version}`, 'version'], { allowFailure: true })
);

/**
 * Checks whether a package version is live on npm without blocking, so several packages can be
 * checked at the same time.
 * @param name The package name.
 * @param version The package version.
 * @returns Whether the version is published.
 */
export const isPublishedAsync = async (name: string, version: string) => toPublished(
  name,
  version,
  await captureAsync('npm', ['view', `${name}@${version}`, 'version'], { allowFailure: true })
);

/**
 * Checks whether a package version can be installed: npm lists it and hands out its tarball.
 * @param name The package name.
 * @param version The package version.
 * @returns Whether the version is installable.
 */
export const isInstallable = async (name: string, version: string) => {
  const { status, stdout } = await captureAsync(
    'npm',
    ['view', `${name}@${version}`, 'dist.tarball'],
    { allowFailure: true }
  );
  const tarball = stdout.trim();

  if (status !== 0 || !tarball) {
    return false;
  }

  try {
    return (await fetch(tarball, {
      method: 'HEAD',
      signal: AbortSignal.timeout(10000),
    })).ok;
  } catch {
    return false;
  }
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
 * Publishes a built package on npm. In the GitHub workflow, npm authenticates the workflow itself
 * (trusted publishing), so no login is needed.
 * @param dir The directory to publish.
 * @param tag The npm dist-tag.
 * @param dryRun Only pack the package without publishing it.
 */
export const publish = (dir: string, tag: string, dryRun: boolean) => {
  run('npm', [
    'publish',
    dir,
    '--access',
    'public',
    '--tag',
    tag,
    ...(dryRun ? ['--dry-run'] : ['--loglevel', 'warn']),
  ]);
};
