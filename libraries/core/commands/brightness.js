import AppCommand from '../classes/AppCommand';
import brightnessRequest from '../classes/BrightnessRequest';
import { logger } from '../helpers';

// The minimum shopgate lib version for the brightness comamnds
const libVersion = '17.0';

/**
 * Sets the screen brightness to the designated value.
 * @param {number} [level=100] Brightness level (from 0 to 100).
 */
export function setBrightness(level = 100) {
  new AppCommand()
    .setCommandName('setBrightness')
    .setCommandParams({ brightness: level })
    .setLibVersion(libVersion)
    .dispatch();
}

/**
 * Resets the screen brightness to system settings.
 */
export function resetBrightness() {
  new AppCommand()
    .setCommandName('resetBrightness')
    .setLibVersion(libVersion)
    .dispatch();
}

/**
 * Returns a promise that resolves with current screen brightness (number).
 * @return {Promise}
 */
export async function getCurrentBrightness() {
  let response;

  try {
    response = await brightnessRequest.dispatch();
  } catch (e) {
    logger.error(e);
    throw e;
  }

  return response;
}
