import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;
const badge = {
  // Before the custom properties the primary color was used for this class.
  background: `var(--color-secondary, ${colors.primary})`,
  borderRadius: 2,
  color: `var(--color-secondary-contrast, ${colors.primaryContrast})`,
  padding: 5,
  width: '100%',
  fontWeight: 700,
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  lineHeight: 1,
  whiteSpace: 'nowrap',
  ...themeConfig.variables.discountBadgeBase,
};

/**
 * The discount badge styles that can be selected by passing the style key.
 * @type {Object}
 */
export default {
  small: css({
    ...badge,
  }).toString(),
  big: css({
    ...badge,
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
  }).toString(),
};
