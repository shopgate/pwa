import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export default css({
  background: colors.light,
  padding: '0 16px',
  ':not(:empty)': {
    marginTop: 16,
  },
  justifyContent: 'space-between',
}).toString();
