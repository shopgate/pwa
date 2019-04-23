import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const container = css({
  bottom: 0,
  backgroundColor: '#fafafa',
  boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
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

