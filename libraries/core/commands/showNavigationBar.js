import AppCommand from '../classes/AppCommand';

/**
 * Sends showNavigationBar command to the app.
 * @param {Object} [params=null] The command parameters.
 */
export default function showNavigationBar(params = null) {
  const command = new AppCommand();

  command
    .setCommandName('showNavigationBar')
    .dispatch(params);
}
