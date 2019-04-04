import AppCommand from '../classes/AppCommand';

/**
 * Sends an openAppSettings command to the app.
 */
export default function openAppSettings() {
  const command = new AppCommand();

  command
    .setCommandName('openAppSettings')
    .dispatch();
}
