import { setTimeout } from 'node:timers/promises';
import { stripVTControlCharacters, styleText } from 'node:util';

const CLEAR_LINE = '\r\u001b[2K';
const SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

let lineOpen = false;

/**
 * Whether lines can be overwritten. Redirected output keeps every line instead.
 * @returns Whether the output is a terminal.
 */
const isTerminal = () => Boolean(process.stdout.isTTY);

/**
 * Shortens a line to the terminal width, since a wrapped line can't be overwritten. A shortened
 * line loses its colors, so no color code gets cut.
 * @param line The line.
 * @returns The line that fits into one terminal row.
 */
const fitToTerminal = (line: string) => {
  const width = process.stdout.columns;
  const plain = stripVTControlCharacters(line);
  return width && plain.length >= width ? `${plain.slice(0, width - 2)}…` : line;
};

/**
 * Shows a line that the next progress or result line replaces on a terminal.
 * @param line The line.
 */
export const showProgress = (line: string) => {
  if (!isTerminal()) {
    console.log(line);
    return;
  }

  process.stdout.write(`${CLEAR_LINE}${fitToTerminal(line)}`);
  lineOpen = true;
};

/**
 * Prints a line that stays, replacing an open progress line on a terminal.
 * @param line The line.
 */
export const showResult = (line: string) => {
  if (lineOpen) {
    process.stdout.write(CLEAR_LINE);
    lineOpen = false;
  }

  console.log(line);
};

/**
 * Keeps an open progress line and moves to the next line, e.g. before a prompt or an error.
 */
export const endProgress = () => {
  if (lineOpen) {
    process.stdout.write('\n');
    lineOpen = false;
  }
};

/**
 * Colors a text on a terminal. Redirected output and NO_COLOR keep the plain text.
 * @param format The style, e.g. "green" or "gray".
 * @param text The text.
 * @param stream The stream the text is written to, which decides whether colors are used.
 * @returns The styled text.
 */
export const color = (
  format: Parameters<typeof styleText>[0],
  text: string,
  stream: NodeJS.WriteStream = process.stdout
) => styleText(format, text, { stream });

/**
 * Waits and meanwhile shows a progress line with an animated spinner, which the next progress or
 * result line replaces. Without a terminal, the line is printed once with the fallback symbol.
 * @param delay Milliseconds to wait.
 * @param render Builds the line for a spinner frame or the fallback symbol.
 * @param fallback Symbol for output that isn't a terminal.
 */
export const waitWithProgress = async (
  delay: number,
  render: (symbol: string) => string,
  fallback: string
) => {
  if (!isTerminal()) {
    console.log(render(fallback));
    await setTimeout(delay);
    return;
  }

  let frame = 0;
  const draw = () => {
    showProgress(render(SPINNER[frame % SPINNER.length]));
    frame += 1;
  };

  draw();
  const timer = setInterval(draw, 100);

  try {
    await setTimeout(delay);
  } finally {
    clearInterval(timer);
  }
};
