import assert from 'node:assert/strict';
import {
  afterEach,
  beforeEach,
  describe,
  it,
  mock,
} from 'node:test';
import {
  endProgress,
  showProgress,
  showResult,
  waitWithProgress,
} from './progress.ts';

const CLEAR_LINE = '\r\u001b[2K';

describe('progress', () => {
  let isTTY: boolean | undefined;
  let columns: number | undefined;
  let written: string[];
  let logged: string[];

  beforeEach(() => {
    ({ isTTY, columns } = process.stdout);
    written = [];
    logged = [];
    mock.method(process.stdout, 'write', (chunk: string | Uint8Array) => {
      if (typeof chunk === 'string') {
        written.push(chunk);
      }
      return true;
    });
    mock.method(console, 'log', (line: string) => {
      logged.push(line);
    });
  });

  afterEach(() => {
    mock.restoreAll();
    process.stdout.isTTY = isTTY as true;
    process.stdout.columns = columns as number;
  });

  it('replaces the progress line with the result on a terminal', () => {
    process.stdout.isTTY = true;
    process.stdout.columns = 120;

    showProgress('⏳ waiting (0:30)');
    showProgress('⏳ waiting (1:00)');
    showResult('✅ done');

    assert.deepEqual(written, [
      `${CLEAR_LINE}⏳ waiting (0:30)`,
      `${CLEAR_LINE}⏳ waiting (1:00)`,
      CLEAR_LINE,
    ]);
    assert.deepEqual(logged, ['✅ done']);
  });

  it('keeps the progress line before a prompt or an error', () => {
    process.stdout.isTTY = true;
    process.stdout.columns = 120;

    showProgress('⏳ waiting (0:30)');
    endProgress();
    showResult('✅ done');

    assert.deepEqual(written, [`${CLEAR_LINE}⏳ waiting (0:30)`, '\n']);
    assert.deepEqual(logged, ['✅ done']);
  });

  it('shortens progress lines to the terminal width', () => {
    process.stdout.isTTY = true;
    process.stdout.columns = 12;

    showProgress('⏳ waiting for the review');
    endProgress();

    assert.equal(written[0], `${CLEAR_LINE}⏳ waiting …`);
  });

  it('keeps every line when the output is no terminal', () => {
    process.stdout.isTTY = false as true;

    showProgress('⏳ waiting (0:30)');
    showResult('✅ done');

    assert.deepEqual(written, []);
    assert.deepEqual(logged, ['⏳ waiting (0:30)', '✅ done']);
  });

  it('drops the colors of a line that has to be shortened', () => {
    process.stdout.isTTY = true;
    process.stdout.columns = 12;

    showProgress('\u001b[33m⏳ waiting for the review\u001b[39m');
    endProgress();

    assert.equal(written[0], `${CLEAR_LINE}⏳ waiting …`);
  });

  it('animates a spinner while waiting on a terminal', async () => {
    process.stdout.isTTY = true;
    process.stdout.columns = 120;

    await waitWithProgress(350, symbol => `${symbol} waiting`, '…');
    endProgress();

    const frames = written.filter(chunk => chunk.startsWith(CLEAR_LINE));
    assert.ok(frames.length >= 3, `only ${frames.length} frames`);
    assert.equal(frames[0], `${CLEAR_LINE}⠋ waiting`);
    assert.equal(frames[1], `${CLEAR_LINE}⠙ waiting`);
    assert.deepEqual(logged, []);
  });

  it('prints the waiting line once when the output is no terminal', async () => {
    process.stdout.isTTY = false as true;

    await waitWithProgress(10, symbol => `${symbol} waiting`, '…');

    assert.deepEqual(written, []);
    assert.deepEqual(logged, ['… waiting']);
  });
});
