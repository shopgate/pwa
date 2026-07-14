import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { hasWebBridge } from '@shopgate/engage/core/helpers';
import { isAdminPreviewActive } from '@shopgate/engage/admin-preview/helpers';
import { setCSSCustomProp } from './cssCustomProperties';

const { colors: { light: defaultBackgroundColor } } = themeConfig;

/**
 * Updates the page background color.
 * @param {string} color The new background color.
 */
export const setPageBackgroundColor = (color = defaultBackgroundColor) => {
  // Curbside website changes never its background color
  if (!hasWebBridge() || isAdminPreviewActive()) {
    setCSSCustomProp('--page-background-color', color);
  }
};
