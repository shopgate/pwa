import AppCommand from '../classes/AppCommand';

/**
 * Sends a setScrollingEnabled command to the app.
 * @param {Object} params The command parameters.
 * @param {boolean} params.enabled Target tab for the page.
 */
export default (params) => {
  new AppCommand()
    .setCommandName('setScrollingEnabled')
    .setCommandParams(params)
    .dispatch();
};
