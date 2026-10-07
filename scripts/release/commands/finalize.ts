import fs from 'node:fs';
import path from 'node:path';
import { extractReleaseNotes } from '../steps/changelog.ts';
import {
  GITHUB_REPO,
  PUBLISHABLE_PACKAGES,
  ROOT,
  getThemes,
} from '../config.ts';
import { logStep } from '../lib/exec.ts';
import {
  git, gitOutput, remoteBranchExists, remoteTagExists,
} from '../lib/git.ts';
import {
  createRelease, createTag, findRelease, getMissingCommits,
} from '../lib/github.ts';
import {
  getPublishRunsUrl, getUnpublished, resolveDistTag, updatesMaster, waitUntilInstallable,
  waitUntilPublished,
} from '../steps/publish.ts';
import { removeReleaseBranches } from '../steps/cleanup.ts';
import { pushSubtrees } from '../steps/subtree.ts';
import { symbols } from '../lib/symbols.ts';
import type { Theme } from '../config.ts';
import type { ReleaseOptions } from '../lib/options.ts';

/**
 * Finishes an approved release: updates master (versions that become "latest") and
 * creates the GitHub releases. Pre-releases only get a tag. Afterwards the release branches
 * are removed. As long as a package is not published on npm, it fails, or waits for it with
 * WAIT_FOR_PUBLISH.
 * @param options The release settings.
 * @param root The repository root.
 */
export const finalizeRelease = async (options: ReleaseOptions, root = ROOT) => {
  const { version, dryRun, waitForPublish } = options;
  const releaseBranch = `releases/${version.name}`;
  const themes = getThemes(root);
  const masterUpdate = updatesMaster(options, root);
  const remotes = [...themes.map(theme => theme.gitUrl), 'origin'];

  if (waitForPublish && !dryRun) {
    await waitUntilPublished(version, root);
  }

  logStep('Checking npm packages');
  const unpublished = getUnpublished(version, root);

  if (unpublished.length > 0 && !dryRun) {
    throw new Error(`Not published yet: ${unpublished.join(', ')}. Nothing was changed so far. Open the run of the "Publish packages" workflow for ${releaseBranch}: ${getPublishRunsUrl(version)}. If it waits for an approval, approve it. If it failed, fix what its log reports and re-run it. When it is done, retry this job.`);
  }

  if (unpublished.length === 0) {
    await waitUntilInstallable(version, root);
    console.log(`${symbols.ok} All ${PUBLISHABLE_PACKAGES.length} packages are published and installable`);
  }

  if (dryRun) {
    if (unpublished.length > 0) {
      console.log(`Dry run: not published yet: ${unpublished.join(', ')}`);
    }

    console.log(`Dry run: would ${masterUpdate ? 'update master and ' : ''}create the ${version.stable ? 'GitHub releases' : 'tags'}.`);
    return;
  }

  if (!remoteBranchExists('origin', releaseBranch)) {
    if (!remoteTagExists('origin', version.name)) {
      throw new Error(`${releaseBranch} doesn't exist on origin. Run the prepare step first.`);
    }

    removeReleaseBranches(remotes, releaseBranch, version.name);
    console.log(`\n${symbols.ok} ${version.version} is released already: the tag ${version.name} exists and ${releaseBranch} is removed.`);
    return;
  }

  logStep(`Checking out ${releaseBranch}`);
  git(['fetch', 'origin']);
  git(['checkout', '-B', releaseBranch, `origin/${releaseBranch}`]);

  if (masterUpdate) {
    const mergedCommits = new Map<Theme, string>();

    for (const theme of themes) {
      logStep(`Checking master of ${theme.githubRepo}`);

      // eslint-disable-next-line no-await-in-loop
      const missing = await getMissingCommits(theme.githubRepo, releaseBranch, 'master');

      if (missing?.total === 0) {
        console.log(`${symbols.ok} ${releaseBranch} of ${theme.githubRepo} contains its master, nothing to merge`);
      } else {
        logStep(`Merging master of ${theme.githubRepo} into ${releaseBranch}`);
        git(['subtree', 'pull', '-q', `--prefix=${theme.dir}`, theme.gitUrl, 'master', '-m', `Merge ${theme.name} master into ${releaseBranch}`], {
          env: { GIT_MERGE_AUTOEDIT: 'no' },
        });
      }

      mergedCommits.set(theme, gitOutput(['rev-parse', 'HEAD']));
    }

    await pushSubtrees(themes, 'master', theme => mergedCommits.get(theme) ?? 'HEAD');

    logStep(`Updating master of ${GITHUB_REPO}`);
    git(['merge', '--no-edit', 'origin/master']);
    git(['push', 'origin', releaseBranch]);
    git(['push', 'origin', `${releaseBranch}:master`]);
  }

  const repos = [...themes.map(theme => theme.githubRepo), GITHUB_REPO];

  if (!version.stable) {
    for (const repo of repos) {
      logStep(`Creating tag ${version.name} in ${repo}`);

      // eslint-disable-next-line no-await-in-loop
      const created = await createTag(repo, version.name, releaseBranch);
      console.log(created ? `${symbols.ok} Tagged ${releaseBranch}` : 'Tag already exists, skipping');
    }

    removeReleaseBranches(remotes, releaseBranch, version.name);
    console.log(`\n${symbols.ok} ${version.version} is released. Pre-releases get no GitHub release, only the tag.`);
    return;
  }

  const latest = resolveDistTag(version, root) === 'latest';
  const body = extractReleaseNotes(fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8'), version.baseName, version.name)
    || 'No notable changes in this release.';

  for (const repo of repos) {
    logStep(`Creating GitHub release ${version.name} in ${repo}`);

    // eslint-disable-next-line no-await-in-loop
    const existing = await findRelease(repo, version.name);

    if (existing) {
      console.log(`Release already exists, skipping: ${existing.html_url}`);
    } else {
      // eslint-disable-next-line no-await-in-loop
      const release = await createRelease(repo, {
        tag: version.name,
        target: masterUpdate && repo !== GITHUB_REPO ? 'master' : releaseBranch,
        body,
        latest,
      });
      console.log(`${symbols.ok} Released: ${release.html_url}`);
    }
  }

  removeReleaseBranches(remotes, releaseBranch, version.name);
  console.log(`\n${symbols.ok} ${version.version} is released.`);
};
