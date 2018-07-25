import AppCommand from '../classes/AppCommand';

/**
 * Sends an openPageExtern command to the app.
 * @param {Object} params The command parameters
 * @param {string} params.src The URL which shall be loaded
 */
export default function openPageExtern(params) {
  const command = new AppCommand();

  command
    .setCommandName('openPageExtern')
    .dispatch(params);
}
