import AppCommand from '../classes/AppCommand';

/**
 * Builds a cleanTab command.
 * @param {Object} params The command parameters.
 * @param {string} params.targetTab Target tab for the page.
 * @return {AppCommand}
 */
export const cleanTabCmd = params => (
  new AppCommand()
    .setCommandName('cleanTab')
    .setCommandParams(params)
);

/**
 * Sends a cleanTab command to the app.
 * @param {Object} params The command parameters.
 * @param {string} params.targetTab Target tab for the page.
 */
export default function cleanTab(params) {
  cleanTabCmd(params)
    .dispatch();
}
