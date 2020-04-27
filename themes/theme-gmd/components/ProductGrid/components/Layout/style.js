import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export default css({
  ':not(:empty)': {
    paddingBottom: 2,
  },
  background: `var(--page-background-color, '${colors.background}')`,
}).toString();
