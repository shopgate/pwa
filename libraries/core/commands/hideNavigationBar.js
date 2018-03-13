import AppCommand from '../classes/AppCommand';

/**
 * Sends hideNavigationBar command to the app.
 * @param {Object} [params=null] The command parameters.
 */
export default (params = null) => {
  const command = new AppCommand();

  command
    .setCommandName('hideNavigationBar')
    .dispatch(params);
};
