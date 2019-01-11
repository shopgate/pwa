import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

export default css({
  bottom: 2,
  color: themeConfig.colors.error,
  fontSize: 12,
  lineHeight: '14px',
  overflow: 'hidden',
  position: 'absolute',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: '100%',
}).toString();
