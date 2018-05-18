import AppCommand from '../classes/AppCommand';

/**
 * Sends hideSplashScreen command to the app.
 */
export default () => {
  const command = new AppCommand();

  command
    .setCommandName('hideSplashScreen')
    .dispatch();
};
