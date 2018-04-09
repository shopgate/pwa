import AppCommand from '../classes/AppCommand';
import brightnessRequest from '../classes/BrightnessRequest';
import capabilities from '../classes/Capabilities';
import { logger } from '../helpers';

const libVersion = '17.0';

/**
 * Resets brightness to system settings.
 */
export const resetBrightness = () => {
  capabilities
    .isCommandSupported('resetBrightness')
    .then(() => {
      new AppCommand()
        .setCommandName('resetBrightness')
        .setLibVersion(libVersion)
        .dispatch();
    })
    .catch(e => {
      if (!e) {
        return;
      }
      logger.error(e);
    })
};

/**
 * Sets brightness.
 * @param {number} level Level (from 0 to 100).
 */
export const setBrightness = (level) => {
  capabilities
    .isCommandSupported('setBrightness')
    .then(() => {
      new AppCommand()
        .setCommandName('setBrightness')
        .setLibVersion(libVersion)
        .setCommandParams({ brightness: level })
        .dispatch();
    })
    .catch(e => {
      if (!e) {
        return;
      }
      logger.error(e);
    })
};

/**
 * Returns promise that would resolve with current brightness (number).
 * @returns {Promise}
 */
export const getCurrentBrightness = () => {
  return new Promise((resolve, reject) => {
    capabilities
      .isCommandSupported('getCurrentBrightness')
      .then(() => {
        return brightnessRequest.dispatch();
      })
      .then(result => {
        resolve(result);
      })
      .catch((e) => {
        if (e) {
          logger.error(e);
        }
        return reject(e);
      })
  });
};
