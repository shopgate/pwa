import AppCommand from '../classes/AppCommand';

/**
 * Sends hideSplashScreen command to the app.
 */
export default function hideSplashScreen() {
  const command = new AppCommand(true, false);

  command
    .setCommandName('hideSplashScreen')
    .dispatch();
}
