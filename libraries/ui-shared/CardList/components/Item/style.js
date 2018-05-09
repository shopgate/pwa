import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

export default css({
  background: themeConfig.colors.light,
  marginBottom: themeConfig.variables.gap.small / 2,
  position: 'relative',
}).toString();
