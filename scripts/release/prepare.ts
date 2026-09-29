import path from 'node:path';
import { ROOT, getThemes } from './config.ts';
import { buildAll } from './build.ts';
import { bumpVersions } from './steps/bump.ts';
import { generateChangelog } from './steps/changelog.ts';
import { checkVersion } from './check.ts';
import { logStep } from './lib/exec.ts';
import {
  git,
  hasChanges,
  hasCommitWithMessage,
  isWorkingTreeClean,
  remoteBranchExists,
} from './lib/git.ts';
import type { ReleaseOptions } from './lib/options.ts';
import { stagePackages } from './steps/stage.ts';

/**
 * Creates or continues the release branch, bumps and builds the packages, adds the changelog,
 * pushes everything to the release branches and stages the packages on npm.
 * @param options The release settings.
 * @param root The repository root.
 */
export const prepareRelease = async (options: ReleaseOptions, root = ROOT) => {
  const { version, branch, dryRun } = options;
  const releaseBranch = `releases/${version.name}`;
  const releasedMessage = `Released ${version.version}`;
  const themes = getThemes(root);

  if (!branch) {
    throw new Error('No source branch given. Pass --branch or set the BRANCH variable.');
  }

  await checkVersion(options, root);

  if (!isWorkingTreeClean()) {
    throw new Error('The working tree has uncommitted changes.');
  }

  logStep(`Checking out ${releaseBranch}`);
  git(['fetch', 'origin']);
  const resumesBranch = remoteBranchExists('origin', releaseBranch);
  git(['checkout', '-B', releaseBranch, `origin/${resumesBranch ? releaseBranch : branch}`]);

  if (!hasCommitWithMessage('HEAD', releasedMessage)) {
    logStep(`Bumping versions to ${version.version}`);
    bumpVersions(version.version, root);
  }

  logStep('Building packages');
  buildAll(root);

  if (!hasCommitWithMessage('HEAD', releasedMessage)) {
    git(['add', '-u']);
    git(['commit', '-m', releasedMessage]);
  }

  logStep('Generating changelog');
  await generateChangelog(version, root);
  const changelogFiles = ['CHANGELOG.md', ...themes.map(theme => path.join(theme.dir, 'CHANGELOG.md'))];

  if (hasChanges(changelogFiles)) {
    git(['add', ...changelogFiles]);
    git(['commit', '-m', `Created changelog for version '${version.name}'.`]);
  }

  if (dryRun) {
    logStep('Dry run: skipping all pushes');
    stagePackages(version, true, root);
    console.log(`\nDry run finished. Delete the local branch with: git checkout ${branch} && git branch -D ${releaseBranch}`);
    return;
  }

  logStep(`Pushing ${releaseBranch}`);
  git(['push', 'origin', releaseBranch]);

  themes.forEach((theme) => {
    logStep(`Pushing ${theme.dir} to ${theme.githubRepo} ${releaseBranch}`);
    git(['subtree', 'push', '-q', `--prefix=${theme.dir}`, theme.gitUrl, releaseBranch]);
  });

  stagePackages(version, false, root);

  console.log([
    '',
    `✔ ${version.version} is prepared and staged on npm.`,
    'Next steps:',
    `  1. Approve the staged packages: "npm run release:new -- approve ${version.version}" or on npmjs.com`,
    '  2. Run the manual "release:finalize" job of the GitLab pipeline',
  ].join('\n'));
};
