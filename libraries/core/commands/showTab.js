import AppCommand from '../classes/AppCommand';
import { logger, hasSGJavaScriptBridge } from '../helpers';

/**
 * Sends a showTab command to the app.
 * @param {params} params The command parameters
 * @param {string} params.targetTab The navigation stack which shall be displayed.
 * @param {string} [params.transition] The type of the transition.
 * @param {number} [params.speedFactor] Speeds up or slows down the transition. Number
 * between 0 and 1 speeds up. Number above 1 slows down.
 */
export default function showTab(params) {
  if (!hasSGJavaScriptBridge()) {
    logger.warn('WARNING: \'showTab\' can only be called in an app environment!');
    return;
  }

  const command = new AppCommand();

  command
    .setCommandName('showTab')
    .dispatch(params);
}
