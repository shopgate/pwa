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
  color: `var(--color-primary, ${colors.primary})`,
}).toString();

export {
  greyStyle,
  prominentStyle,
};
