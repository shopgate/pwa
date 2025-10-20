import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { hasWebBridge } from '@shopgate/engage/core/helpers';
import { IS_PAGE_PREVIEW_ACTIVE } from '@shopgate/engage/page/constants';
import { setCSSCustomProp } from './cssCustomProperties';

const { colors: { light: defaultBackgroundColor } } = themeConfig;

/**
 * Updates the page background color.
 * @param {string} color The new background color.
 */
export const setPageBackgroundColor = (color = defaultBackgroundColor) => {
  // Curbside website changes never its background color
  if (!hasWebBridge() || IS_PAGE_PREVIEW_ACTIVE) {
    setCSSCustomProp('--page-background-color', color);
  }
};
