import { spawnSync } from 'node:child_process';

/**
 * Options for running an external command.
 */
export interface RunOptions {
  /**
   * Working directory of the command. Defaults to the current process directory.
   */
  cwd?: string;
  /**
   * Additional environment variables, merged into the current environment.
   */
  env?: Record<string, string>;
  /**
   * Don't throw when the command exits with a non-zero status.
   */
  allowFailure?: boolean;
}

/**
 * Result of an external command whose output was captured.
 */
export interface CaptureResult {
  /**
   * Exit status of the command. 0 means success.
   */
  status: number;
  /**
   * Captured standard output.
   */
  stdout: string;
  /**
   * Captured error output.
   */
  stderr: string;
}

/**
 * Spawns a command synchronously, either capturing or streaming its output.
 * @param command The executable.
 * @param args The command arguments.
 * @param options The run options.
 * @param capture Whether to capture the output instead of streaming it.
 * @returns The exit status and the captured output.
 */
const spawn = (
  command: string,
  args: string[],
  options: RunOptions,
  capture: boolean
): CaptureResult => {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    env: {
      ...process.env,
      ...options.env,
    },
    encoding: 'utf8',
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    maxBuffer: 256 * 1024 * 1024,
  });

  if (result.error) {
    throw result.error;
  }

  const status = result.status ?? 1;

  if (status !== 0 && !options.allowFailure) {
    const details = capture ? `\n${result.stderr.trim()}` : '';
    throw new Error(`Command failed (exit ${status}): ${command} ${args.join(' ')}${details}`);
  }

  return {
    status,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
};

/**
 * Runs a command with live output and throws when it fails, unless allowFailure is set.
 * @param command The executable.
 * @param args The command arguments.
 * @param options The run options.
 * @returns The exit status.
 */
export const run = (command: string, args: string[], options: RunOptions = {}): number => {
  console.log(`$ ${command} ${args.join(' ')}`);
  return spawn(command, args, options, false).status;
};

/**
 * Runs a command silently and returns its exit status and output.
 * @param command The executable.
 * @param args The command arguments.
 * @param options The run options.
 * @returns The exit status and the captured output.
 */
export const capture = (
  command: string,
  args: string[],
  options: RunOptions = {}
): CaptureResult => spawn(command, args, options, true);

/**
 * Runs a script entry point and turns errors into a readable message and exit code 1.
 * @param main The entry point.
 */
export const runMain = (main: () => Promise<void> | void) => {
  Promise.resolve()
    .then(main)
    .catch((error: unknown) => {
      console.error(`\n✖ ${error instanceof Error ? error.message : String(error)}`);
      process.exitCode = 1;
    });
};

/**
 * Prints a step headline to structure the CI log.
 * @param title The step title.
 */
export const logStep = (title: string) => {
  console.log(`\n==> ${title}`);
};
