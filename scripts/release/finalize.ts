import fs from 'node:fs';
import path from 'node:path';
import { extractReleaseNotes } from './steps/changelog.ts';
import {
  GITHUB_REPO,
  PUBLISHABLE_PACKAGES,
  ROOT,
  getPackageName,
  getThemes,
} from './config.ts';
import { logStep } from './lib/exec.ts';
import { git, remoteBranchExists } from './lib/git.ts';
import { createRelease, findRelease } from './lib/github.ts';
import { isPublished } from './lib/npm.ts';
import { resolveDistTag } from './steps/stage.ts';
import type { ReleaseOptions } from './lib/options.ts';

/**
 * Finishes an approved release: updates master (stable releases with UPDATE_MASTER) and
 * creates the GitHub releases. Fails as long as a package is not published on npm.
 * @param options The release settings.
 * @param root The repository root.
 */
export const finalizeRelease = async (options: ReleaseOptions, root = ROOT) => {
  const {
    version,
    updateMaster,
    draftRelease,
    dryRun,
  } = options;
  const releaseBranch = `releases/${version.name}`;
  const themes = getThemes(root);
  const updatesMaster = version.stable && updateMaster;

  logStep('Checking npm packages');
  const unpublished = PUBLISHABLE_PACKAGES
    .map(pkg => getPackageName(pkg.dir, root))
    .filter(name => !isPublished(name, version.version));

  if (unpublished.length > 0 && !dryRun) {
    throw new Error(`Not published yet: ${unpublished.join(', ')}. Approve them with "npm run release:new -- approve ${version.version}" or on npmjs.com.`);
  }

  if (dryRun) {
    if (unpublished.length > 0) {
      console.log(`Dry run: not published yet: ${unpublished.join(', ')}`);
    }

    console.log(`Dry run: would ${updatesMaster ? 'update master and ' : ''}create the GitHub releases.`);
    return;
  }

  if (!remoteBranchExists('origin', releaseBranch)) {
    throw new Error(`${releaseBranch} doesn't exist on origin. Run the prepare step first.`);
  }

  logStep(`Checking out ${releaseBranch}`);
  git(['fetch', 'origin']);
  git(['checkout', '-B', releaseBranch, `origin/${releaseBranch}`]);

  if (updatesMaster) {
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

  const target = updatesMaster ? 'master' : releaseBranch;
  const latest = resolveDistTag(version, root) === 'latest';
  const body = extractReleaseNotes(fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8'), version.baseName);

  for (const repo of [GITHUB_REPO, ...themes.map(theme => theme.githubRepo)]) {
    logStep(`Creating GitHub release ${version.name} in ${repo}`);

    // eslint-disable-next-line no-await-in-loop
    if (await findRelease(repo, version.name)) {
      console.log('Release already exists, skipping');
    } else {
      // eslint-disable-next-line no-await-in-loop
      await createRelease(repo, {
        tag: version.name,
        target,
        draft: draftRelease,
        prerelease: !version.stable,
        body,
        latest,
      });
    }
  }

  console.log(`\n✔ ${version.version} is released.`);
};
