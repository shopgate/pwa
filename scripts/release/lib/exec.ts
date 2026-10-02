import { spawn as spawnAsync, spawnSync } from 'node:child_process';
import { getCommandHint } from './hints.ts';
import { symbols } from './symbols.ts';

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
 * Builds the error message of a failed command, with a hint how to continue when there is one.
 * @param command The executable.
 * @param args The command arguments.
 * @param status The exit status.
 * @param details Captured error output.
 * @returns The message.
 */
const describeFailure = (command: string, args: string[], status: number, details = '') => {
  const hint = getCommandHint(command, args);
  return `Command failed (exit ${status}): ${command} ${args.join(' ')}${details}${hint ? `\n${hint}` : ''}`;
};

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
    throw new Error(describeFailure(command, args, status, details));
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
 * Runs a command with live output without blocking, so several commands can run at the same
 * time. Rejects when the command fails, unless allowFailure is set.
 * @param command The executable.
 * @param args The command arguments.
 * @param options The run options.
 * @returns The exit status.
 */
export const runAsync = (
  command: string,
  args: string[],
  options: RunOptions = {}
): Promise<number> => {
  console.log(`$ ${command} ${args.join(' ')}`);

  return new Promise((resolve, reject) => {
    const child = spawnAsync(command, args, {
      cwd: options.cwd,
      env: {
        ...process.env,
        ...options.env,
      },
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('close', (code) => {
      const status = code ?? 1;

      if (status !== 0 && !options.allowFailure) {
        reject(new Error(describeFailure(command, args, status)));
        return;
      }

      resolve(status);
    });
  });
};

/**
 * Runs a command silently without blocking and returns its exit status and output, so several
 * commands can run at the same time. Rejects when the command fails, unless allowFailure is set.
 * @param command The executable.
 * @param args The command arguments.
 * @param options The run options.
 * @returns The exit status and the captured output.
 */
export const captureAsync = (
  command: string,
  args: string[],
  options: RunOptions = {}
): Promise<CaptureResult> => new Promise((resolve, reject) => {
  const child = spawnAsync(command, args, {
    cwd: options.cwd,
    env: {
      ...process.env,
      ...options.env,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let stdout = '';
  let stderr = '';

  child.stdout.on('data', (chunk: Buffer) => {
    stdout += chunk.toString();
  });
  child.stderr.on('data', (chunk: Buffer) => {
    stderr += chunk.toString();
  });
  child.on('error', reject);
  child.on('close', (code) => {
    const status = code ?? 1;

    if (status !== 0 && !options.allowFailure) {
      reject(new Error(describeFailure(command, args, status, `\n${stderr.trim()}`)));
      return;
    }

    resolve({
      status,
      stdout,
      stderr,
    });
  });
});

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
 * Turns an error into a message that includes its causes, e.g. the network error behind
 * "fetch failed".
 * @param error The error.
 * @returns The message.
 */
export const describeError = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const { code } = error as { code?: string };
  const message = code && !error.message.includes(code) ? `${error.message} (${code})` : error.message;

  return error.cause === undefined ? message : `${message}: ${describeError(error.cause)}`;
};

/**
 * Runs a script entry point and turns errors into a readable message and exit code 1.
 * @param main The entry point.
 */
export const runMain = (main: () => Promise<void> | void) => {
  Promise.resolve()
    .then(main)
    .catch((error: unknown) => {
      console.error(`\n${symbols.error} ${describeError(error)}`);
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
