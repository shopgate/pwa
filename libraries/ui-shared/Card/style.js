import { css } from 'glamor';
import { themeConfig, themeName } from '@shopgate/pwa-common/helpers/config';

const isIOS = themeName.includes('ios');

export default css({
  boxShadow: themeConfig.shadows.productCard,
  margin: '5px 5px 10px',
  borderRadius: isIOS ? 10 : 2,
  background: themeConfig.colors.light,
  overflow: 'hidden',
  position: 'relative',
}).toString();
