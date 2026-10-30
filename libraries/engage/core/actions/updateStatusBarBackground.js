import Color from 'color';
import { isIos } from '@shopgate/pwa-common/selectors/client';
import {
  appSupportsAndroidEdgeToEdge,
  appSupportsInAppBrowserColors,
} from '@shopgate/engage/core/helpers';
import { getCSSCustomProp } from '@shopgate/engage/styles/helpers/cssCustomProperties';
import { isColor } from '@shopgate/engage/styles/theme/utils/color';
import { updateLegacyNavigationBar } from '../helpers/updateLegacyNavigationBar';

/**
 * Resolves the colors of the configured app bar for the in-app browser of the app. They are
 * independent of the passed status bar color, which can be transparent or belong to another bar.
 * @returns {Object|null} The navigation bar styles of the in-app browser.
 */
const getInAppBrowserColors = () => {
  const background = getCSSCustomProp('--sg-components-appBar-background');

  if (!isColor(background)) {
    return null;
  }

  const color = getCSSCustomProp('--sg-components-appBar-color');
  const contentBackground = getCSSCustomProp('--sg-palette-background-default');

  return {
    styles: {
      background,
      ...isColor(color) && { color },
      ...isColor(contentBackground) && { contentBackground },
    },
    statusBarStyle: Color(background).isDark() ? 'light' : 'dark',
  };
};

/**
 * Updates the status bar background on iOS and Android devices that support edge-to-edge screens.
 * Apps that theme their in-app browser with the app bar colors receive the update on every device.
 * @param {string} color The background color.
 * @param {boolean} isDefault When set, the status bar will init with the color on next app start.
 * @return {Function} A redux thunk.
 */
export default function updateStatusBarBackground(color, isDefault = false) {
  return (dispatch, getState) => {
    const inAppBrowser = appSupportsInAppBrowserColors() ? getInAppBrowserColors() : null;

    if (!isIos(getState()) && !appSupportsAndroidEdgeToEdge() && !inAppBrowser) {
      return;
    }

    updateLegacyNavigationBar({
      ...color && ({ statusBarBackground: color }),
      ...inAppBrowser && ({ inAppBrowser }),
      isDefault,
    });
  };
}
