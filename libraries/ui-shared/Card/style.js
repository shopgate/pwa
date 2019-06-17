import { css } from 'glamor';
import { themeConfig, themeName } from '@shopgate/pwa-common/helpers/config';

const shadow = '0 4px 8px rgba(0,0,0,0.16)';
const isIOS = themeName.includes('ios');

export default css({
  boxShadow: shadow,
  margin: '5px 5px 10px',
  borderRadius: isIOS ? 10 : 2,
  background: themeConfig.colors.light,
  overflow: 'hidden',
  position: 'relative',
}).toString();
