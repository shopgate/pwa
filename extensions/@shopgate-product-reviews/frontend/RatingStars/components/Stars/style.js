import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const container = css({
  position: 'relative',
}).toString();

const icon = css({
  display: 'inline-block',
  verticalAlign: 'top',
  outline: 0,
}).toString();

const emptyStars = css({
  color: colors.shade7,
}).toString();

const filledStars = css({
  position: 'absolute',
  color: `var(--color-primary, ${colors.primary})`,
  top: 0,
}).toString();

/**
 * The rating stars styles that can be selected by passing the style key to the
 * @type {Object}
 */
const iconStyles = {
  small: {
    iconSize: '1em',
    iconStyle: css({
      marginRight: '0.1em',
    }).toString(),
  },
  big: {
    iconSize: '1.24em',
    iconStyle: css({
      marginRight: '0.12em',
    }).toString(),
  },
  large: {
    iconSize: '2.3em',
    iconStyle: css({
      marginRight: '0.23em',
    }).toString(),
  },
};

export default {
  container,
  icon,
  iconStyles,
  emptyStars,
  filledStars,
};
