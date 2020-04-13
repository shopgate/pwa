import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const baseIcon = {
  width: 24,
  height: 24,
};

const checkedIcon = css({
  ...baseIcon,
  color: `var(--color-secondary, ${colors.accent})`,
}).toString();

const uncheckedIcon = css({
  ...baseIcon,
  color: colors.shade6,
}).toString();

export default {
  checkedIcon,
  uncheckedIcon,
};
