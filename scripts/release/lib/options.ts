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
   * Don't update master, although the version becomes "latest" (SKIP_MASTER_UPDATE).
   * Defaults to false.
   */
  skipMasterUpdate: boolean;
  /**
   * Allow continuing an interrupted release of the same version (RESUME). Defaults to false.
   */
  resume: boolean;
  /**
   * Work locally only: no pushes and "npm publish --dry-run" (DRY_RUN). Defaults to false.
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
      'skip-master-update': { type: 'boolean' },
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
    skipMasterUpdate: values['skip-master-update'] ?? envFlag('SKIP_MASTER_UPDATE', false),
    resume: values.resume ?? envFlag('RESUME', false),
    dryRun: values['dry-run'] ?? envFlag('DRY_RUN', false),
  };
};
