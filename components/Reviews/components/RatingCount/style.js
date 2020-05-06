import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const main = {
  fontSize: 12,
  margin: '0 0.5em',
  lineHeight: '2em',
};

const greyStyle = css({
  ...main,
  color: colors.shade3,
  fontSize: 12,
}).toString();

const prominentStyle = css({
  ...main,
  // Before the custom properties the primary color was used for the rating stars.
  color: `var(--color-secondary, ${colors.primary})`,
}).toString();

export {
  greyStyle,
  prominentStyle,
};
