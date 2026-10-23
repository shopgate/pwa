import { isAvailable } from '@shopgate/native-modules';
import { isIos } from '@shopgate/pwa-common/selectors/client';
import { appSupportsAndroidEdgeToEdge } from '@shopgate/engage/core/helpers';
import { getCSSCustomProp } from '@shopgate/engage/styles/helpers/cssCustomProperties';
import { updateLegacyNavigationBar } from '../helpers/updateLegacyNavigationBar';

/**
 * Updates the status bar background on iOS and Android devices that support edge-to-edge screens.
 * React Native apps receive the update on every Android version, since they also use the colors
 * for the in-app browser.
 * @param {string} color The background color.
 * @param {boolean} isDefault When set, the status bar will init with the color on next app start.
 * @param {string} [textColor] The text color of the app bar.
 * @return {Function} A redux thunk.
 */
export default function updateStatusBarBackground(color, isDefault = false, textColor = null) {
  return (dispatch, getState) => {
    if (!isIos(getState()) && !appSupportsAndroidEdgeToEdge() && !isAvailable()) {
      return;
    }

    const contentBackground = getCSSCustomProp('--sg-palette-background-default');

    updateLegacyNavigationBar({
      ...color && ({ statusBarBackground: color }),
      ...textColor && ({ color: textColor }),
      ...contentBackground && ({ contentBackground }),
      isDefault,
    });
  };
}
