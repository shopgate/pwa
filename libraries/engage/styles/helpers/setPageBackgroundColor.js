import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { setCSSCustomProp } from './cssCustomProperties';

const { colors: { light: defaultBackgroundColor } } = themeConfig;

/**
 * Updates the page background color.
 * @param {string} color The new background color.
 */
export const setPageBackgroundColor = (color = defaultBackgroundColor) => {
  setCSSCustomProp('--page-background-color', color);
};
