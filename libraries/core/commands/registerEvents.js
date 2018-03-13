import AppCommand from '../classes/AppCommand';

/**
 * Sends registerEvents command to the app.
 * This registers the WebView to certain app events.
 * @param {Array} events Events that should be registered.
 */
export default (events) => {
  const command = new AppCommand();

  command
    .setCommandName('registerEvents')
    .dispatch({ events });
};
