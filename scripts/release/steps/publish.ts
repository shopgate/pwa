import fs from 'node:fs';
import path from 'node:path';
import {
  PUBLISHABLE_PACKAGES,
  ROOT,
  getPackageName,
  getPublishDir,
  readJson,
} from '../config.ts';
import type { PublishablePackage } from '../config.ts';
import { logStep } from '../lib/exec.ts';
import { getDistTagVersion, isPublished, publish } from '../lib/npm.ts';
import { getDistTag, isMasterRelease } from '../lib/version.ts';
import type { ReleaseOptions } from '../lib/options.ts';
import type { ReleaseVersion } from '../lib/version.ts';

/**
 * Returns the npm dist-tag of a version, based on the version "latest" currently points to.
 * @param version The version to release.
 * @param root The repository root.
 * @returns The dist-tag.
 */
export const resolveDistTag = (version: ReleaseVersion, root = ROOT) => (
  getDistTag(version, getDistTagVersion(getPackageName(PUBLISHABLE_PACKAGES[0].dir, root), 'latest'))
);

/**
 * Whether the release updates master: the version becomes "latest" on npm and SKIP_MASTER_UPDATE
 * isn't set.
 * @param options The release settings.
 * @param root The repository root.
 * @returns Whether master gets updated.
 */
export const updatesMaster = (
  options: Pick<ReleaseOptions, 'version' | 'skipMasterUpdate'>,
  root = ROOT
) => (
  !options.skipMasterUpdate
  && isMasterRelease(options.version, getDistTagVersion(getPackageName(PUBLISHABLE_PACKAGES[0].dir, root), 'latest'))
);

/**
 * Makes sure that the build of a package contains the version to release.
 * @param pkg The package.
 * @param version The version to release.
 * @param root The repository root.
 */
export const assertBuiltVersion = (
  pkg: PublishablePackage,
  version: ReleaseVersion,
  root = ROOT
) => {
  const publishDir = getPublishDir(pkg, root);
  const manifest = path.join(publishDir, 'package.json');
  const builtVersion = fs.existsSync(manifest)
    ? readJson<{ version: string }>(manifest).version
    : null;

  if (builtVersion !== version.version) {
    throw new Error(`${path.relative(root, publishDir)} contains version ${builtVersion}, expected ${version.version}. Run the build first.`);
  }
};

/**
 * Returns the names of the packages whose version isn't published on npm yet.
 * @param version The version to release.
 * @param root The repository root.
 * @param check Checks whether a package version is published.
 * @returns The package names, in publishing order.
 */
export const getUnpublished = (version: ReleaseVersion, root = ROOT, check = isPublished) => (
  PUBLISHABLE_PACKAGES
    .map(pkg => getPackageName(pkg.dir, root))
    .filter(name => !check(name, version.version))
);

/**
 * Makes sure that packages are only published for real by the GitHub workflow, which waits for
 * an approval and adds the provenance. Everywhere else, only a dry run is allowed.
 * @param dryRun Whether the packages are only packed.
 * @param env The environment variables.
 */
export const assertPublishAllowed = (dryRun: boolean, env = process.env) => {
  if (!dryRun && env.GITHUB_ACTIONS !== 'true') {
    throw new Error('Packages are only published by the "Publish packages" workflow on GitHub. Pass --dry-run to only pack them.');
  }
};

/**
 * Functions that publishPackages uses to talk to npm. Tests replace them.
 */
export interface PublishSettings {
  /**
   * Checks whether a package version is published.
   */
  check?: typeof isPublished;
  /**
   * Publishes a built package.
   */
  send?: typeof publish;
  /**
   * The npm dist-tag. Asked from npm by default.
   */
  distTag?: string;
}

/**
 * Publishes all publishable packages on npm, dependencies first. Versions that are already
 * published are skipped, so the step can be repeated after a failure. The builds of all packages
 * to publish are checked before the first one is published.
 * @param version The version to release.
 * @param dryRun Only pack the packages without publishing them.
 * @param root The repository root.
 * @param settings The functions that talk to npm.
 */
export const publishPackages = (
  version: ReleaseVersion,
  dryRun: boolean,
  root = ROOT,
  settings: PublishSettings = {}
) => {
  const { check = isPublished, send = publish } = settings;
  const distTag = settings.distTag ?? resolveDistTag(version, root);
  logStep(`Publishing ${PUBLISHABLE_PACKAGES.length} packages on npm (dist-tag "${distTag}")`);

  const pending = PUBLISHABLE_PACKAGES.filter((pkg) => {
    const name = getPackageName(pkg.dir, root);
    const published = check(name, version.version);

    if (published) {
      console.log(`- ${name}@${version.version} already published, skipping`);
    }

    return !published;
  });

  pending.forEach(pkg => assertBuiltVersion(pkg, version, root));
  pending.forEach(pkg => send(getPublishDir(pkg, root), distTag, dryRun));
};
