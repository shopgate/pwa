import { AndroidNavigationBar } from '@shopgate/native-modules';
import { logger, appSupportsAndroidEdgeToEdge } from '@shopgate/engage/core/helpers';

/**
 * @typedef {Object} UpdateAndroidNavigationBarOptions
 * @property {string} [color] Color for the navigation bar.
 * Accepts hex, hex with alpha, rgb(), or rgba().
 */

let lastOptions = null;

/**
 * Updates the Android navigation bar style based on the provided visual options.
 * Typically used to match app UI to system navigation bar for a more native look and feel.
 *
 * @param {UpdateAndroidNavigationBarOptions} [options={}] Visual customization options for
 * the nav bar.
 */
export const updateAndroidNavigationBarColor = (options = {}) => {
  // Only necessary for Android devices with edge-to-edge screens
  if (!appSupportsAndroidEdgeToEdge()) {
    return;
  }

  const { color } = options;

  const needsUpdate = !lastOptions || options.color !== lastOptions.color;

  if (needsUpdate) {
    try {
      AndroidNavigationBar.setColor({ color });
      lastOptions = { ...options };
    } catch (e) {
      logger.error('Error updating Android navigation bar color', e);
    }
  }
};
