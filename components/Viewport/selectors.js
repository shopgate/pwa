import { createSelector } from 'reselect';
import variables from 'Styles/variables';
import { getClientInformation } from '@shopgate/pwa-common/selectors/client';

/**
 * Calculates page insets for the current device
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getPageInsets = createSelector(
  getClientInformation,
  (clientInformation) => {
    const { device: { model = '' } = {} } = clientInformation;

    const defaults = {
      safeAreaInsetTop: variables.statusBar.height,
      safeAreaInsetBottom: 0,
      safeAreaInsetLeft: 0,
      safeAreaInsetRight: 0,
    };

    let overrides = {};

    const iphoneX = ['iPhone10,3', 'iPhone10,6'];

    // Detect the iPhone X to apply special insets
    if (iphoneX.includes(model)) {
      overrides = {
        safeAreaInsetTop: 40,
        safeAreaInsetBottom: 30,
      };
    }

    return {
      ...defaults,
      ...overrides,
    };
  }
);
