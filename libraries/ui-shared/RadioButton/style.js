import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const baseIcon = {
  width: 24,
  height: 24,
};

const checkedIcon = css({
  ...baseIcon,
  color: themeConfig.colors.accent,
}).toString();

const uncheckedIcon = css({
  ...baseIcon,
  color: themeConfig.colors.shade6,
}).toString();

export default {
  checkedIcon,
  uncheckedIcon,
};
