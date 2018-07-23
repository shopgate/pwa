import AppCommand from '../classes/AppCommand';
import { hasSGJavaScriptBridge } from '../helpers';

/**
 * Sends an onload command if in the native app environment.
 */
export default function onload() {
  // This command is only needed inside an app environment.
  if (!hasSGJavaScriptBridge()) {
    return;
  }

  const command = new AppCommand();

  command
    .setCommandName('onload')
    .dispatch();
}
