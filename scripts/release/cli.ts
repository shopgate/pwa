import { parseArgs } from 'node:util';
import { approveRelease } from './approve.ts';
import { buildAll, normalizeAll, purgeAll } from './build.ts';
import { checkVersion } from './check.ts';
import { finalizeRelease } from './finalize.ts';
import { runMain } from './lib/exec.ts';
import { getOptions } from './lib/options.ts';
import { prepareRelease } from './prepare.ts';
import { renderChangelog } from './steps/changelog.ts';

/**
 * A command of the release CLI.
 */
interface Command {
  /**
   * Arguments shown in the help, e.g. "<version>".
   */
  usage: string;
  /**
   * One-line description shown in the help.
   */
  description: string;
  /**
   * Runs the command with the remaining command line arguments.
   */
  run: (args: string[]) => Promise<void> | void;
}

const OPTIONS_HELP = [
  ['--branch <name>', 'Source branch of the release', 'BRANCH'],
  ['--update-master', 'Update master for stable releases', 'UPDATE_MASTER'],
  ['--no-draft-release', 'Publish the GitHub releases directly', 'DRAFT_RELEASE'],
  ['--resume', 'Continue an interrupted release of the same version', 'RESUME'],
  ['--dry-run', 'Local only: no pushes, "npm stage publish --dry-run"', 'DRY_RUN'],
];

const COMMANDS: Record<string, Command> = {
  check: {
    usage: '<version>',
    description: 'Check that the version is still free on npm, git and GitHub',
    run: args => checkVersion(getOptions(args)),
  },
  prepare: {
    usage: '<version>',
    description: 'Bump, build, changelog, push the release branches and stage on npm',
    run: args => prepareRelease(getOptions(args)),
  },
  approve: {
    usage: '<version>',
    description: 'Approve the staged packages with your npm 2FA (developer machine)',
    run: args => approveRelease(getOptions(args).version),
  },
  finalize: {
    usage: '<version>',
    description: 'Update master (stable releases) and create the GitHub releases',
    run: args => finalizeRelease(getOptions(args)),
  },
  changelog: {
    usage: '<version>',
    description: 'Show the changelog entry of the version without writing any files',
    run: async (args) => {
      const { latestChanges, exists } = await renderChangelog(getOptions(args).version);

      if (exists) {
        console.log('CHANGELOG.md already contains this version.');
      } else {
        console.log(latestChanges || 'No labeled pull requests since the previous stable version.');
      }
    },
  },
  build: {
    usage: '[--purge|--normalize-only]',
    description: 'Build all packages into "dist" without publishing',
    run: (args) => {
      const { values } = parseArgs({
        args,
        options: {
          purge: { type: 'boolean' },
          'normalize-only': { type: 'boolean' },
        },
      });

      if (values.purge) {
        purgeAll();
      } else if (values['normalize-only']) {
        normalizeAll();
      } else {
        buildAll();
      }
    },
  },
};

/**
 * Prints the available commands and options.
 */
const printHelp = () => {
  const commands = Object.entries(COMMANDS)
    .map(([name, command]) => `  ${`${name} ${command.usage}`.padEnd(40)}${command.description}`);
  const options = OPTIONS_HELP
    .map(([flag, description, env]) => `  ${flag.padEnd(40)}${description} (${env})`);

  console.log([
    'Usage: npm run release:new -- <command> [version] [options]',
    '',
    'Commands:',
    ...commands,
    `  ${'help'.padEnd(40)}Show this overview`,
    '',
    'Options (also read from the environment variables of the GitLab form):',
    ...options,
    '',
    'The version can also be passed via VERSION.',
  ].join('\n'));
};

const [name, ...args] = process.argv.slice(2);

if (!name || name === 'help' || name === '--help') {
  printHelp();
} else if (!COMMANDS[name]) {
  console.error(`Unknown command "${name}".\n`);
  printHelp();
  process.exitCode = 1;
} else {
  runMain(() => COMMANDS[name].run(args));
}
