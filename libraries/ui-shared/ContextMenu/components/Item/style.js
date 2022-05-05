import { css } from 'glamor';
import Color from 'color';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
// import { getCSSCustomProp } from '@shopgate/engage/styles';

/**
 * Get the item class.
 * @param {bool} disabled Disabled.
 * @returns {string}
 */
export const getItemClass = (disabled) => {
  let background = themeConfig.colors.shade8;
  const customPropColor = themeConfig.colors.primary;

  if (customPropColor) {
    background = Color(customPropColor).alpha(0.04);
  }

  return css({
    position: 'relative',
    whiteSpace: 'nowrap',
    marginBottom: 2,
    padding: `${themeConfig.variables.gap.big * 0.875}px ${themeConfig.variables.gap.big * 1.375}px`,
    lineHeight: 1,
    zIndex: 1,
    color: disabled ? themeConfig.colors.shade4 : 'inherits',
    ...(!disabled ? ({
      cursor: 'pointer',
      ':hover': {
        background,
      },
    }) : {
      cursor: 'default',
    }),
  }).toString();
};
