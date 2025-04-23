import { isIos } from '@shopgate/pwa-common/selectors/client';
import { appSupportsAndroidEdgeToEdge } from '@shopgate/engage/core/helpers';
import { updateLegacyNavigationBar } from '../helpers/updateLegacyNavigationBar';

/**
 * Updates the status bar background on iOS and Android devices that support edge-to-edge screens.
 * @param {string} color The background color.
 * @param {boolean} isDefault When set, the status bar will init with the color on next app start.
 * @return {Function} A redux thunk.
 */
export default function updateStatusBarBackground(color, isDefault = false) {
  return (dispatch, getState) => {
    if (!isIos(getState()) && !appSupportsAndroidEdgeToEdge()) {
      return;
    }

    updateLegacyNavigationBar({
      ...color && ({ statusBarBackground: color }),
      isDefault,
    });
  };
}
