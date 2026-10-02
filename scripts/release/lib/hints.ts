const RETRY = 'Retry the job. Steps that already went through are skipped or report "Everything up-to-date".';
const SSH_KEY = 'If it keeps failing, check that the SSH key in the CI/CD variable SSH_GITHUB_AUTH of pwa-liveupdate has write access to the repository.';
const NPM_TOKEN = 'If npm reports E401 or E403, the CI/CD variable NPM_STAGE_TOKEN of pwa-liveupdate is expired or has no access to the package: renew it on npmjs.com ("Read and write", stage only).';

/**
 * Explains how to continue after an external command failed.
 * @param command The executable.
 * @param args The command arguments.
 * @returns The hint, or undefined when there's no general advice for the command.
 */
export const getCommandHint = (command: string, args: string[]): string | undefined => {
  const [subcommand, action] = args;

  if (command === 'git') {
    if (subcommand === 'subtree' && action === 'pull') {
      return 'If git reports a merge conflict, the master of the theme repository was changed directly: resolve it on the release branch as described in "When something fails" of scripts/release/README.md. Otherwise retry the job.';
    }

    if (subcommand === 'merge') {
      return 'Merge master into the release branch by hand, resolve the conflicts, push the release branch and retry the job.';
    }

    if (subcommand === 'push' || subcommand === 'subtree') {
      return `${RETRY} A push that was rejected because the target moved in the meantime goes through on the retry. ${SSH_KEY}`;
    }

    if (['fetch', 'clone', 'ls-remote'].includes(subcommand)) {
      return `GitHub may have been unreachable. ${RETRY} ${SSH_KEY}`;
    }

    return undefined;
  }

  if (command === 'npm') {
    if (subcommand === 'stage') {
      return `${RETRY} ${NPM_TOKEN}`;
    }

    if (subcommand === 'install') {
      return `The npm registry may have been unreachable: ${RETRY}`;
    }
  }

  return undefined;
};

/**
 * Explains how to continue after a GitHub API request failed with an HTTP status.
 * @param status The HTTP status.
 * @returns The hint.
 */
export const getGithubHint = (status: number) => {
  if (status === 401) {
    return 'The GitHub token is invalid or expired: renew GITHUB_AUTH_TOKEN in the CI/CD variables of pwa-liveupdate (or in your environment), then retry.';
  }

  if (status === 403 || status === 429) {
    return 'The GitHub token has no access or hit the rate limit: check the permissions of GITHUB_AUTH_TOKEN, or wait a few minutes, then retry.';
  }

  return 'GitHub may have a problem: retry now. If https://www.githubstatus.com reports an incident, retry once it is resolved.';
};

/**
 * Where to read on after any failure of the release CLI.
 */
export const README_HINT = 'How to continue: see "When something fails" in scripts/release/README.md.';
