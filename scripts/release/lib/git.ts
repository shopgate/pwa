import { capture, run, runAsync } from './exec.ts';
import type { RunOptions } from './exec.ts';

/**
 * Runs a git command with live output.
 * @param args The git arguments.
 * @param options The run options.
 * @returns The exit status.
 */
export const git = (args: string[], options?: RunOptions) => run('git', args, options);

/**
 * Runs a git command with live output without blocking.
 * @param args The git arguments.
 * @param options The run options.
 * @returns The exit status.
 */
export const gitAsync = (args: string[], options?: RunOptions) => runAsync('git', args, options);

/**
 * Runs a git command and returns its trimmed output.
 * @param args The git arguments.
 * @param options The run options.
 * @returns The trimmed standard output.
 */
export const gitOutput = (args: string[], options?: RunOptions) => (
  capture('git', args, options).stdout.trim()
);

/**
 * Checks whether a branch exists on a remote.
 * @param remote Remote name or URL.
 * @param branch The branch name.
 * @returns Whether the branch exists.
 */
export const remoteBranchExists = (remote: string, branch: string) => (
  gitOutput(['ls-remote', '--heads', remote, `refs/heads/${branch}`]) !== ''
);

/**
 * Checks whether a tag exists on a remote.
 * @param remote Remote name or URL.
 * @param tag The tag name.
 * @returns Whether the tag exists.
 */
export const remoteTagExists = (remote: string, tag: string) => (
  gitOutput(['ls-remote', '--tags', remote, `refs/tags/${tag}`]) !== ''
);

/**
 * Checks whether the working tree has no uncommitted changes.
 * @returns Whether the working tree is clean.
 */
export const isWorkingTreeClean = () => gitOutput(['status', '--porcelain']) === '';

/**
 * Checks whether the history of a ref contains a commit with exactly this subject.
 * @param ref The ref whose history is searched.
 * @param message The commit subject.
 * @returns Whether such a commit exists.
 */
export const hasCommitWithMessage = (ref: string, message: string) => (
  gitOutput(['log', ref, '--format=%s', '--fixed-strings', `--grep=${message}`])
    .split('\n')
    .includes(message)
);

/**
 * Checks whether any of the given paths have uncommitted changes.
 * @param paths Paths relative to the working directory.
 * @returns Whether there are changes.
 */
export const hasChanges = (paths: string[]) => (
  gitOutput(['status', '--porcelain', '--', ...paths]) !== ''
);
