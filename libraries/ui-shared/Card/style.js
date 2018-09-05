import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const shadow = '0 5px 7px rgba(0,0,0,0.09), 0 3px 6px rgba(0,0,0,0.07)';

export default css({
  boxShadow: shadow,
  margin: '5px 5px 10px',
  borderRadius: 2,
  background: themeConfig.colors.light,
  overflow: 'hidden',
  position: 'relative',
}).toString();
