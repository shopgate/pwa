import fs from 'node:fs';
import path from 'node:path';
import {
  PUBLISHABLE_PACKAGES,
  ROOT,
  getPackageName,
  getPublishDir,
} from '../config.ts';
import { logStep } from '../lib/exec.ts';
import { findStagedVersion, isPublished, stagePublish } from '../lib/npm.ts';
import type { ReleaseVersion } from '../lib/version.ts';

/**
 * Stages all publishable packages on npm. Versions that are already staged or published
 * are skipped, so the step can be retried.
 * @param version The version to release.
 * @param dryRun Only pack the packages without staging them.
 * @param root The repository root.
 */
export const stagePackages = (version: ReleaseVersion, dryRun: boolean, root = ROOT) => {
  logStep(`Staging ${PUBLISHABLE_PACKAGES.length} packages on npm (dist-tag "${version.distTag}")`);

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
      ? JSON.parse(fs.readFileSync(manifest, 'utf8')).version
      : null;

    if (builtVersion !== version.version) {
      throw new Error(`${path.relative(root, publishDir)} contains version ${builtVersion}, expected ${version.version}. Run the build first.`);
    }

    stagePublish(publishDir, version.distTag, dryRun);
  });
};
