import AppCommand from '../classes/AppCommand';

/**
 * Sends broadcastEvent command to the app.
 * @param {Object} params The command parameters.
 * @param {string} params.event The custom event name.
 * @param {Object} params.parameters The custom event parameters.
 */
export default function broadcastEvent(params) {
  const command = new AppCommand();

  command
    .setCommandName('broadcastEvent')
    .dispatch(params);
}
