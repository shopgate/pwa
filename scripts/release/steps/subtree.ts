import type { Theme } from '../config.ts';
import { logStep } from '../lib/exec.ts';
import { gitAsync } from '../lib/git.ts';

/**
 * Pushes the folder of a theme at a commit to a branch of its own repository.
 * @param theme The theme.
 * @param commit The pwa commit whose theme folder is pushed.
 * @param branch The target branch in the theme repository.
 * @returns The exit status.
 */
const pushSubtree = (theme: Theme, commit: string, branch: string) => (
  gitAsync(['subtree', 'push', '-q', `--prefix=${theme.dir}`, theme.gitUrl, `${commit}:${branch}`])
);

/**
 * Pushes the theme folders to their repositories at the same time, since each "git subtree push"
 * spends minutes splitting the history. Waits for all pushes before reporting failed ones.
 * @param themes The themes.
 * @param branch The target branch in the theme repositories.
 * @param commitOf The pwa commit to push per theme. Defaults to HEAD.
 * @param push Pushes a single theme.
 */
export const pushSubtrees = async (
  themes: Theme[],
  branch: string,
  commitOf: (theme: Theme) => string = () => 'HEAD',
  push = pushSubtree
) => {
  logStep(`Pushing ${themes.map(theme => theme.dir).join(' and ')} to ${branch} of their repositories`);

  const results = await Promise.allSettled(
    themes.map(theme => push(theme, commitOf(theme), branch))
  );
  const failed = themes.filter((_, index) => results[index].status === 'rejected');

  if (failed.length > 0) {
    throw new Error(`Pushing ${failed.map(theme => theme.githubRepo).join(' and ')} to ${branch} failed. See the git output above.`);
  }
};
