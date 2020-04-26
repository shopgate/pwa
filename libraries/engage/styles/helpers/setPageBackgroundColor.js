import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { hasWebBridge } from '@shopgate/engage/core';
import { setCSSCustomProp } from './cssCustomProperties';

const { colors: { light: defaultBackgroundColor } } = themeConfig;

/**
 * Updates the page background color.
 * @param {string} color The new background color.
 */
export const setPageBackgroundColor = (color = defaultBackgroundColor) => {
  if (!hasWebBridge) {
    setCSSCustomProp('--page-background-color', color);
  }
};
