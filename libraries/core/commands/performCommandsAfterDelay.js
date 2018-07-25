import AppCommand from '../classes/AppCommand';

/**
 * Builds a performCommandsAfterDelay command.
 * @param {Object} params The command parameters.
 * @return {AppCommand}
 */
export const performCommandsAfterDelayCmd = params => (
  new AppCommand()
    .setCommandName('performCommandsAfterDelay')
    .setCommandParams(params)
);

/**
 * Sends a performCommandsAfterDelay command to the app.
 * @param {Object} params The command parameters.
 */
export default function performCommandsAfterDelay(params) {
  performCommandsAfterDelayCmd(params)
    .dispatch();
}
