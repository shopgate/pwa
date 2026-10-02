import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import {
  afterEach,
  beforeEach,
  describe,
  it,
  mock,
} from 'node:test';
import { buildNotificationScript, notify } from './notify.ts';

/**
 * Creates a fake child process that can emit errors.
 * @returns The fake process.
 */
const fakeChild = () => Object.assign(new EventEmitter(), { unref: mock.fn() });

describe('notify', () => {
  let isTTY: boolean | undefined;
  let platform: NodeJS.Platform;
  let ci: string | undefined;
  let written: string[];

  beforeEach(() => {
    ({ isTTY } = process.stdout);
    ({ platform } = process);
    ci = process.env.CI;
    delete process.env.CI;
    written = [];
    mock.method(process.stdout, 'write', (chunk: string) => {
      written.push(chunk);
      return true;
    });
  });

  afterEach(() => {
    mock.restoreAll();
    process.stdout.isTTY = isTTY as true;
    Object.defineProperty(process, 'platform', { value: platform });

    if (ci === undefined) {
      delete process.env.CI;
    } else {
      process.env.CI = ci;
    }
  });

  /**
   * Sets the environment of the notification.
   * @param terminal Whether stdout is a terminal.
   * @param os The operating system.
   */
  const setEnvironment = (terminal: boolean, os: NodeJS.Platform) => {
    process.stdout.isTTY = terminal as true;
    Object.defineProperty(process, 'platform', { value: os });
  };

  it('rings the bell and shows a notification on macOS', () => {
    setEnvironment(true, 'darwin');
    const child = fakeChild();
    const run = mock.fn(() => child);

    notify('PWA release', '7.33.0 is published.', 'Glass', run as never);

    assert.deepEqual(written, ['\u0007']);
    assert.deepEqual(run.mock.calls[0].arguments.slice(0, 2), [
      'osascript',
      ['-e', 'display notification "7.33.0 is published." with title "PWA release" sound name "Glass"'],
    ]);
    assert.equal(child.unref.mock.callCount(), 1);
  });

  it('ignores a failing notification', () => {
    setEnvironment(true, 'darwin');
    const child = fakeChild();

    notify('PWA release', 'done', 'Basso', (() => child) as never);

    assert.doesNotThrow(() => child.emit('error', new Error('spawn osascript ENOENT')));
  });

  it('only rings the bell on other systems', () => {
    setEnvironment(true, 'linux');
    const run = mock.fn();

    notify('PWA release', 'done', 'Ping', run as never);

    assert.deepEqual(written, ['\u0007']);
    assert.equal(run.mock.callCount(), 0);
  });

  it('does nothing outside a terminal or in CI', () => {
    const run = mock.fn();

    setEnvironment(false, 'darwin');
    notify('PWA release', 'done', 'Ping', run as never);

    setEnvironment(true, 'darwin');
    process.env.CI = 'true';
    notify('PWA release', 'done', 'Ping', run as never);

    assert.deepEqual(written, []);
    assert.equal(run.mock.callCount(), 0);
  });

  it('quotes the texts for AppleScript', () => {
    assert.equal(
      buildNotificationScript('Say "hi"', 'C:\\path', 'Ping'),
      'display notification "C:\\\\path" with title "Say \\"hi\\"" sound name "Ping"'
    );
  });
});
