import fs from 'node:fs';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import {
  GITHUB_REPO,
  PUBLISHABLE_PACKAGES,
  PUBLISH_WORKFLOW,
  ROOT,
  getPackageName,
  getPublishDir,
  readJson,
} from '../config.ts';
import type { PublishablePackage } from '../config.ts';
import { mapWithLimit } from '../lib/concurrency.ts';
import { logStep } from '../lib/exec.ts';
import {
  getDistTagVersion, isInstallable, isPublished, publish,
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

/**
 * Returns the address of the "Publish packages" workflow runs of a release branch.
 * @param version The version to release.
 * @returns The address.
 */
export const getPublishRunsUrl = (version: ReleaseVersion) => (
  `https://github.com/${GITHUB_REPO}/actions/workflows/${PUBLISH_WORKFLOW}?query=${encodeURIComponent(`branch:releases/${version.name}`)}`
);

/**
 * Settings of waitUntilPublished. Tests replace the lookup and the waiting.
 */
export interface PublishWaitSettings {
  /**
   * Returns the names of the packages that are not published yet.
   */
  lookup?: () => string[];
  /**
   * Waits for the given number of milliseconds.
   */
  sleep?: (duration: number) => Promise<unknown>;
  /**
   * How long to wait in total, in milliseconds.
   */
  timeout?: number;
  /**
   * Pause between two lookups, in milliseconds.
   */
  interval?: number;
  /**
   * Returns the current time in milliseconds.
   */
  now?: () => number;
  /**
   * After how many milliseconds an unchanged state is logged again.
   */
  reminder?: number;
}

/**
 * Waits until all packages of the version are published on npm, which the GitHub workflow does
 * after the release branch was pushed. A lookup that fails counts as not published yet.
 * @param version The version to release.
 * @param root The repository root.
 * @param settings The lookup and the timing.
 */
export const waitUntilPublished = async (
  version: ReleaseVersion,
  root = ROOT,
  settings: PublishWaitSettings = {}
) => {
  const {
    lookup = () => getUnpublished(version, root),
    sleep = (duration: number) => delay(duration),
    timeout = 30 * 60 * 1000,
    interval = 30 * 1000,
    now = Date.now,
    reminder = 5 * 60 * 1000,
  } = settings;
  const start = now();
  let state = '';
  let logged = start;

  logStep(`Waiting until the ${PUBLISHABLE_PACKAGES.length} packages are published`);

  for (;;) {
    let missing: string[] | null = null;
    let message: string;

    try {
      missing = lookup();
      message = `Waiting for: ${missing.join(', ')}`;
    } catch (error) {
      message = `npm couldn't be asked, trying again: ${String(error).split('\n')[0]}`;
    }

    if (missing?.length === 0) {
      return;
    }

    const waited = now() - start;

    if (waited >= timeout) {
      throw new Error(`Not published after ${Math.round(timeout / 60000)} minutes${missing ? `: ${missing.join(', ')}` : ''}. Nothing was changed so far. Open the run of the "Publish packages" workflow for releases/${version.name}: ${getPublishRunsUrl(version)}. If it waits for an approval, approve it. If it failed, fix what its log reports and re-run it. If it is still running, let it finish. Then retry this job.`);
    }

    if (message !== state) {
      console.log(message);
      state = message;
      logged = now();
    } else if (now() - logged >= reminder) {
      console.log(`Still waiting after ${Math.round(waited / 60000)} minutes`);
      logged = now();
    }

    // eslint-disable-next-line no-await-in-loop
    await sleep(interval);
  }
};

/**
 * Settings of waitUntilInstallable. Tests replace the lookup and the waiting.
 */
export interface WaitSettings {
  /**
   * Checks whether a package version is installable.
   */
  check?: typeof isInstallable;
  /**
   * Waits for the given number of milliseconds.
   */
  sleep?: (duration: number) => Promise<unknown>;
  /**
   * How long to wait in total, in milliseconds.
   */
  timeout?: number;
  /**
   * Pause between two rounds of checks, in milliseconds.
   */
  interval?: number;
}

/**
 * Waits until all packages of the version can be installed. A new version can take a moment
 * until the registry hands it out everywhere.
 * @param version The released version.
 * @param root The repository root.
 * @param settings The lookup and the timing.
 */
export const waitUntilInstallable = async (
  version: ReleaseVersion,
  root = ROOT,
  settings: WaitSettings = {}
) => {
  const {
    check = isInstallable,
    sleep = (duration: number) => delay(duration),
    timeout = 10 * 60 * 1000,
    interval = 15 * 1000,
  } = settings;
  let missing = PUBLISHABLE_PACKAGES.map(pkg => getPackageName(pkg.dir, root));
  let waited = 0;

  logStep(`Checking that the ${missing.length} packages can be installed`);

  for (;;) {
    // eslint-disable-next-line no-await-in-loop
    const states = await mapWithLimit(missing, 6, name => check(name, version.version));
    missing = missing.filter((name, index) => !states[index]);

    if (missing.length === 0) {
      return;
    }

    if (waited >= timeout) {
      throw new Error(`Not installable after ${Math.round(timeout / 60000)} minutes: ${missing.join(', ')}. Either npm couldn't be reached from here, or it doesn't hand out the versions yet: check https://status.npmjs.org and the package pages on npmjs.com, then run the step again.`);
    }

    console.log(`Waiting for: ${missing.join(', ')}`);
    // eslint-disable-next-line no-await-in-loop
    await sleep(interval);
    waited += interval;
  }
};
