import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const container = css({
  bottom: 0,
  backgroundColor: '#fafafa',
  boxShadow: themeConfig.shadows.scannerBar,
  fontSize: 14,
  alignItems: 'center',
}).toString();

const column = css({
  margin: `${themeConfig.variables.gap.big}px`,
  ':not(:first-child)': {
    marginLeft: 0,
  },
}).toString();

export default {
  container,
  column,
};

