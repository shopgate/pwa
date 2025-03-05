import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export default css({
  color: `${colors.shade11}) !important`,
  position: 'relative',
  display: 'inline-block',
  width: 'auto',
  zIndex: '1',
}).toString();
