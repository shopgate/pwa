import fs from 'node:fs';
import path from 'node:path';
import {
  PUBLISHABLE_PACKAGES,
  ROOT,
  getPackageName,
  getPublishDir,
  readJson,
} from '../config.ts';
import { logStep } from '../lib/exec.ts';
import {
  findStagedVersion,
  getDistTagVersion,
  isPublished,
  stagePublish,
} from '../lib/npm.ts';
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
 * Stages all publishable packages on npm. Versions that are already staged or published
 * are skipped, so the step can be retried.
 * @param version The version to release.
 * @param dryRun Only pack the packages without staging them.
 * @param root The repository root.
 */
export const stagePackages = (version: ReleaseVersion, dryRun: boolean, root = ROOT) => {
  const distTag = resolveDistTag(version, root);
  logStep(`Staging ${PUBLISHABLE_PACKAGES.length} packages on npm (dist-tag "${distTag}")`);

  PUBLISHABLE_PACKAGES.forEach((pkg) => {
    const name = getPackageName(pkg.dir, root);
    const publishDir = getPublishDir(pkg, root);

    if (isPublished(name, version.version)) {
      console.log(`- ${name}@${version.version} already published, skipping`);
      return;
    }

    if (findStagedVersion(name, version.version)) {
      console.log(`- ${name}@${version.version} already staged, skipping`);
      return;
    }

    const manifest = path.join(publishDir, 'package.json');
    const builtVersion = fs.existsSync(manifest)
      ? readJson<{ version: string }>(manifest).version
      : null;

    if (builtVersion !== version.version) {
      throw new Error(`${path.relative(root, publishDir)} contains version ${builtVersion}, expected ${version.version}. Run the build first.`);
    }

    stagePublish(publishDir, distTag, dryRun);
  });
};
