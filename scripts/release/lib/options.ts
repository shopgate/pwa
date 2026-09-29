import { parseArgs } from 'node:util';
import { parseVersion } from './version.ts';
import type { ReleaseVersion } from './version.ts';

/**
 * Release settings from the GitLab form (environment) or the command line.
 */
export interface ReleaseOptions {
  /**
   * The version to release.
   */
  version: ReleaseVersion;
  /**
   * Source branch of the release (BRANCH). Empty when not given; only prepare needs it.
   */
  branch: string;
  /**
   * Update master and the theme master branches for stable releases (UPDATE_MASTER).
   * Defaults to false.
   */
  updateMaster: boolean;
  /**
   * Create the GitHub releases as drafts (DRAFT_RELEASE). Defaults to true.
   */
  draftRelease: boolean;
  /**
   * Allow continuing an interrupted release of the same version (RESUME). Defaults to false.
   */
  resume: boolean;
  /**
   * Work locally only: no pushes and "npm stage publish --dry-run" (DRY_RUN). Defaults to false.
   */
  dryRun: boolean;
}

/**
 * Reads a "true"/"false" environment variable.
 * @param name The variable name.
 * @param fallback Value when the variable is unset or empty.
 * @returns The flag value.
 */
const envFlag = (name: string, fallback: boolean) => {
  const value = process.env[name]?.trim().toLowerCase();

  if (value === undefined || value === '') {
    return fallback;
  }

  if (value !== 'true' && value !== 'false') {
    throw new Error(`Invalid value "${process.env[name]}" for ${name}. Use "true" or "false".`);
  }

  return value === 'true';
};

/**
 * Collects the release settings. Command line arguments take precedence over environment variables.
 * @param argv The command line arguments.
 * @returns The release settings.
 */
export const getOptions = (argv = process.argv.slice(2)): ReleaseOptions => {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      branch: { type: 'string' },
      'update-master': { type: 'boolean' },
      'draft-release': { type: 'boolean' },
      resume: { type: 'boolean' },
      'dry-run': { type: 'boolean' },
    },
    allowNegative: true,
  });

  const version = positionals[0] ?? process.env.VERSION ?? '';

  if (!version.trim()) {
    throw new Error('No version given. Pass it as first argument or via the VERSION variable.');
  }

  return {
    version: parseVersion(version),
    branch: values.branch ?? process.env.BRANCH?.trim() ?? '',
    updateMaster: values['update-master'] ?? envFlag('UPDATE_MASTER', false),
    draftRelease: values['draft-release'] ?? envFlag('DRAFT_RELEASE', true),
    resume: values.resume ?? envFlag('RESUME', false),
    dryRun: values['dry-run'] ?? envFlag('DRY_RUN', false),
  };
};
