import { css } from 'glamor';
import Color from 'color';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { getCSSCustomProp } from '@shopgate/engage/styles';

/**
 * Get the item class.
 * @returns {string}
 */
export const getItemClass = () => {
  let background = themeConfig.colors.shade8;
  const customPropColor = getCSSCustomProp('--color-primary');

  if (customPropColor) {
    background = Color(customPropColor).alpha(0.05);
  }

  return css({
    position: 'relative',
    whiteSpace: 'nowrap',
    padding: `${themeConfig.variables.gap.big * 0.875}px ${themeConfig.variables.gap.big * 1.375}px`,
    lineHeight: 1,
    zIndex: 1,
    cursor: 'pointer',
    ':hover': {
      background,
    },
  }).toString();
};
