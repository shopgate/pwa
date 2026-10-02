import { spawn } from 'node:child_process';

/**
 * macOS system sound of a notification: Glass when something is done, Ping when input is
 * needed, Basso when something failed.
 */
export type NotificationSound = 'Glass' | 'Ping' | 'Basso';

/**
 * Builds the AppleScript that shows a macOS notification.
 * @param title The notification title.
 * @param message The notification text.
 * @param sound The macOS system sound.
 * @returns The script.
 */
export const buildNotificationScript = (
  title: string,
  message: string,
  sound: NotificationSound
) => {
  const quote = (text: string) => `"${text.replace(/[\\"]/g, '\\$&')}"`;
  return `display notification ${quote(message)} with title ${quote(title)} sound name ${quote(sound)}`;
};

/**
 * Draws attention to the terminal, e.g. when an approval is done or needs input: rings the
 * terminal bell and shows a notification on macOS. Does nothing outside a terminal, and
 * failures are ignored, since the notification is only a convenience.
 * @param title The notification title.
 * @param message The notification text.
 * @param sound The macOS system sound.
 * @param run Starts the notification process.
 */
export const notify = (
  title: string,
  message: string,
  sound: NotificationSound,
  run = spawn
) => {
  if (!process.stdout.isTTY || process.env.CI === 'true') {
    return;
  }

  process.stdout.write('\u0007');

  if (process.platform !== 'darwin') {
    return;
  }

  const child = run('osascript', ['-e', buildNotificationScript(title, message, sound)], {
    detached: true,
    stdio: 'ignore',
  });
  child.on('error', () => undefined);
  child.unref();
};
