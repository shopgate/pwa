import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const error = css({
  position: 'absolute',
  bottom: 2,
  fontSize: 12,
  lineHeight: '14px',
  color: themeConfig.colors.error,
  // ...ellipsisLine, TODO: needed?
}).toString();

export default {
  error,
};
