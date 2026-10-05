import path from 'node:path';
import { ROOT, getThemes } from '../config.ts';
import { buildAll } from './build.ts';
import { bumpVersions, updateLockfile } from '../steps/bump.ts';
import { generateChangelog } from '../steps/changelog.ts';
import { checkVersion, pipelineLine } from './check.ts';
import { logStep, run } from '../lib/exec.ts';
import {
  getWorkingTreeChanges,
  git,
  hasChanges,
  hasCommitWithMessage,
  remoteBranchExists,
} from '../lib/git.ts';
import { symbols } from '../lib/symbols.ts';
import type { ReleaseOptions } from '../lib/options.ts';
import { stagePackages } from '../steps/stage.ts';
import { pushSubtrees } from '../steps/subtree.ts';

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

  const changes = getWorkingTreeChanges();

  if (changes) {
    throw new Error([
      'The working tree has uncommitted or untracked changes:',
      changes,
      'In CI, a step before the release changed the clone: make it leave these files unchanged or add them to .gitignore.',
      'Locally: commit them, stash them with "git stash -u" or remove them.',
    ].join('\n'));
  }

  logStep(`Checking out ${releaseBranch}`);
  git(['fetch', 'origin']);
  const resumesBranch = remoteBranchExists('origin', releaseBranch);
  git(['checkout', '-B', releaseBranch, `origin/${resumesBranch ? releaseBranch : branch}`]);

  logStep('Checking types');
  run(process.execPath, [path.join(root, 'scripts', 'typecheck', 'run.mts')], { cwd: root });

  if (!hasCommitWithMessage('HEAD', releasedMessage)) {
    logStep(`Bumping versions to ${version.version}`);
    bumpVersions(version.version, root);
    updateLockfile(root);
  }

  logStep('Building packages');
  buildAll(root);

  if (!hasCommitWithMessage('HEAD', releasedMessage)) {
    const pipelineId = process.env.CI_PIPELINE_ID;
    git(['add', '-u']);
    git(['commit', '--no-verify', '-m', releasedMessage, ...(pipelineId ? ['-m', pipelineLine(pipelineId)] : [])]);
  }

  logStep('Generating changelog');
  await generateChangelog(version, root);
  const changelogFiles = ['CHANGELOG.md', ...themes.map(theme => path.join(theme.dir, 'CHANGELOG.md'))];

  if (hasChanges(changelogFiles)) {
    git(['add', ...changelogFiles]);
    git(['commit', '--no-verify', '-m', `Created changelog for version '${version.name}'.`]);
  }

  if (dryRun) {
    logStep('Dry run: skipping all pushes');
    stagePackages(version, true, root);
    console.log(`\nDry run finished. Delete the local branch with: git checkout ${branch} && git branch -D ${releaseBranch}`);
    return;
  }

  logStep(`Pushing ${releaseBranch}`);
  git(['push', 'origin', releaseBranch]);

  await pushSubtrees(themes, releaseBranch);

  stagePackages(version, false, root);

  console.log([
    '',
    `${symbols.ok} ${version.version} is prepared and staged on npm.`,
    'Next steps:',
    `  1. Approve the staged packages: "npm run release -- approve ${version.version}" or on npmjs.com`,
    '  2. Run the manual "release:finalize" job of the GitLab pipeline',
  ].join('\n'));
};
