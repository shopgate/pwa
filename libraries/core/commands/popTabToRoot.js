import AppCommand from '../classes/AppCommand';

/**
 * Builds an popTabToRoot command.
 * @param {Object} params The command parameters.
 * @param {string} params.targetTab The navigation stack that shall be popped to root view.
 * @return {AppCommand}
 */
export const popTabToRootCmd = params => (
  new AppCommand()
    .setCommandName('popTabToRoot')
    .setCommandParams(params)
);

/**
 * Sends an popTabToRoot command to the app.
 * @param {Object} params The command parameters.
 * @param {string} params.targetTab The navigation stack that shall be popped to root view.
 */
export default function popTabToRoot(params) {
  popTabToRootCmd(params)
    .dispatch();
}
