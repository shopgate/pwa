import { isIos } from '@shopgate/pwa-common/selectors/client';
import { updateLegacyNavigationBar } from '../helpers/updateLegacyNavigationBar';

/**
 * Updates the status bar background on iOS devices.
 * @param {string} color The background color.
 * @param {boolean} isDefault When set, the status bar will init with the color on next app start.
 * @return {Function} A redux thunk.
 */
export default function updateStatusBarBackground(color, isDefault = false) {
  return (dispatch, getState) => {
    if (!isIos(getState())) {
      return;
    }

    updateLegacyNavigationBar({
      ...color && ({ statusBarBackground: color }),
      isDefault,
    });
  };
}
