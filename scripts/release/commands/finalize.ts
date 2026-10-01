import fs from 'node:fs';
import path from 'node:path';
import { extractReleaseNotes } from '../steps/changelog.ts';
import {
  GITHUB_REPO,
  PUBLISHABLE_PACKAGES,
  ROOT,
  getPackageName,
  getThemes,
} from '../config.ts';
import { logStep } from '../lib/exec.ts';
import { git, remoteBranchExists } from '../lib/git.ts';
import { createRelease, findRelease } from '../lib/github.ts';
import { isPublished } from '../lib/npm.ts';
import { resolveDistTag, updatesMaster } from '../steps/stage.ts';
import type { ReleaseOptions } from '../lib/options.ts';

/**
 * Finishes an approved release: updates master (versions that become "latest") and
 * creates the GitHub releases. Fails as long as a package is not published on npm.
 * @param options The release settings.
 * @param root The repository root.
 */
export const finalizeRelease = async (options: ReleaseOptions, root = ROOT) => {
  const { version, dryRun } = options;
  const releaseBranch = `releases/${version.name}`;
  const themes = getThemes(root);
  const masterUpdate = updatesMaster(options, root);

  logStep('Checking npm packages');
  const unpublished = PUBLISHABLE_PACKAGES
    .map(pkg => getPackageName(pkg.dir, root))
    .filter(name => !isPublished(name, version.version));

  if (unpublished.length > 0 && !dryRun) {
    throw new Error(`Not published yet: ${unpublished.join(', ')}. Approve them with "npm run release -- approve ${version.version}" or on npmjs.com.`);
  }

  if (unpublished.length === 0) {
    console.log(`✔ All ${PUBLISHABLE_PACKAGES.length} packages are published`);
  }

  if (dryRun) {
    if (unpublished.length > 0) {
      console.log(`Dry run: not published yet: ${unpublished.join(', ')}`);
    }

    console.log(`Dry run: would ${masterUpdate ? 'update master and ' : ''}create the GitHub releases.`);
    return;
  }

  if (!remoteBranchExists('origin', releaseBranch)) {
    throw new Error(`${releaseBranch} doesn't exist on origin. Run the prepare step first.`);
  }

  logStep(`Checking out ${releaseBranch}`);
  git(['fetch', 'origin']);
  git(['checkout', '-B', releaseBranch, `origin/${releaseBranch}`]);

  if (masterUpdate) {
    themes.forEach((theme) => {
      logStep(`Updating master of ${theme.githubRepo}`);
      git(['subtree', 'pull', '-q', `--prefix=${theme.dir}`, theme.gitUrl, 'master', '-m', `Merge ${theme.name} master into ${releaseBranch}`], {
        env: { GIT_MERGE_AUTOEDIT: 'no' },
      });
      git(['subtree', 'push', '-q', `--prefix=${theme.dir}`, theme.gitUrl, 'master']);
    });

    logStep(`Updating master of ${GITHUB_REPO}`);
    git(['merge', '--no-edit', 'origin/master']);
    git(['push', 'origin', releaseBranch]);
    git(['push', 'origin', `${releaseBranch}:refs/heads/${version.name}`]);
    git(['push', 'origin', `${releaseBranch}:master`]);
  }

  const target = masterUpdate ? 'master' : releaseBranch;
  const latest = resolveDistTag(version, root) === 'latest';
  const body = extractReleaseNotes(fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8'), version.baseName, version.name)
    || 'No notable changes in this release.';

  for (const repo of [...themes.map(theme => theme.githubRepo), GITHUB_REPO]) {
    logStep(`Creating GitHub release ${version.name} in ${repo}`);

    // eslint-disable-next-line no-await-in-loop
    const existing = await findRelease(repo, version.name);

    if (existing) {
      console.log(`Release already exists, skipping: ${existing.html_url}`);
    } else {
      // eslint-disable-next-line no-await-in-loop
      const release = await createRelease(repo, {
        tag: version.name,
        target,
        prerelease: !version.stable,
        body,
        latest,
      });
      console.log(`✔ Released: ${release.html_url}`);
    }
  }

  console.log(`\n✔ ${version.version} is released.`);
};
