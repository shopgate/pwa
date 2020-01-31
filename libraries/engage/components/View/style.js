import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors: { light: defaultBackgroundColor } } = themeConfig;

/**
 * Updates the page background color.
 * @param {string} color The new background color.
 */
const updatePageBackgroundColor = (color = defaultBackgroundColor) => {
  const { style } = document.documentElement;
  if (style.getPropertyValue('--page-background-color') !== color) {
    style.setProperty('--page-background-color', color);
  }
};

/**
 * @param {string} color The new page background color.
 */
export const setBackgroundColor = (color) => {
  updatePageBackgroundColor(color);
};

export default css({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 1,
});
