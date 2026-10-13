import { describeError, logStep } from '../lib/exec.ts';
import { git, remoteBranchExists, remoteTagExists } from '../lib/git.ts';
import { symbols } from '../lib/symbols.ts';

/**
 * Functions that removeReleaseBranches uses to talk to the remotes. Tests replace them.
 */
export interface CleanupSettings {
  /**
   * Checks whether a branch exists on a remote.
   */
  branchExists?: typeof remoteBranchExists;
  /**
   * Checks whether a tag exists on a remote.
   */
  tagExists?: typeof remoteTagExists;
  /**
   * Deletes a branch on a remote.
   */
  remove?: (remote: string, branch: string) => void;
}

/**
 * Deletes the release branch on the given remotes, one after another. A released version is
 * referenced by its tag, so the branch is only removed where that tag exists. A deletion that
 * fails is reported and doesn't stop the release, which is complete at this point.
 * @param remotes Remote names or URLs.
 * @param branch The release branch.
 * @param tag The tag of the released version.
 * @param settings The functions that talk to the remotes.
 */
export const removeReleaseBranches = (
  remotes: string[],
  branch: string,
  tag: string,
  settings: CleanupSettings = {}
) => {
  const {
    branchExists = remoteBranchExists,
    tagExists = remoteTagExists,
    remove = (remote: string, name: string) => git(['push', remote, `:refs/heads/${name}`]),
  } = settings;

  logStep(`Removing ${branch}`);

  remotes.forEach((remote) => {
    try {
      if (!branchExists(remote, branch)) {
        console.log(`${remote}: already removed`);
      } else if (!tagExists(remote, tag)) {
        console.warn(`${symbols.warning} ${remote}: the tag ${tag} doesn't exist, ${branch} is kept`);
      } else {
        remove(remote, branch);
        console.log(`${symbols.ok} ${remote}: removed, the version stays available as tag ${tag}`);
      }
    } catch (error) {
      console.warn(`${symbols.warning} ${remote}: ${branch} couldn't be removed, the release is complete anyway. Delete the branch by hand. ${describeError(error).split('\n')[0]}`);
    }
  });
};
