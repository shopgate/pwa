import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const icon = css({
  width: 24,
  height: 24,
}).toString();

const checkedIcon = css({
  color: `var(--color-secondary, ${themeConfig.colors.accent})`,
}).toString();

const uncheckedIcon = css({
  color: themeConfig.colors.shade6,
}).toString();

export default {
  icon,
  checkedIcon,
  uncheckedIcon,
};
