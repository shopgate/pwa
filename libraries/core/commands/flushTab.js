import AppCommand from '../classes/AppCommand';

/**
 * Sends a flushTab command to the app.
 * @param {Object} params The command parameters.
 * @param {string} params.targetTab Target tab for the page.
 */
export default function flushTab(params) {
  const command = new AppCommand();

  command
    .setCommandName('flushTab')
    .dispatch(params);
}
