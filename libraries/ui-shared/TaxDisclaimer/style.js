import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

export default css({
  background: themeConfig.colors.background,
  display: 'block',
  fontSize: 12,
  padding: `20px ${themeConfig.variables.gap.big}px`,
  textAlign: 'left',
}).toString();
