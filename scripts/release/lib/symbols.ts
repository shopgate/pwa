const inCi = process.env.CI === 'true';

/**
 * Status symbols of the CLI output: emoji on developer machines, plain characters in CI logs.
 */
export const symbols = inCi
  ? {
    ok: '✔',
    error: '✖',
    warning: '⚠',
  }
  : {
    ok: '✅',
    error: '❌',
    warning: '⚠️',
  };
