import { isIos } from '@shopgate/pwa-common/selectors/client';
import { updateLegacyNavigationBar } from '../helpers/updateLegacyNavigationBar';

/**
 * Updates the status bar background on iOS devices.
 * @param {string} color The background color.
 * @return {Function} A redux thunk.
 */
export default function updateStatusBarBackground(color) {
  return (dispatch, getState) => {
    if (!isIos(getState())) {
      return;
    }

    updateLegacyNavigationBar({
      ...color && ({ statusBarBackground: color }),
    });
  };
}
