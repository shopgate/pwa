import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export default css({
  ':not(:empty)': {
    paddingBottom: 2,
  },
  background: colors.background,
}).toString();
