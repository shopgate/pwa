import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const label = css({
  background: themeConfig.colors.dark,
  opacity: 0.1,
  width: '100%',
  height: 16,
  marginBottom: 12,
}).toString();

export default {
  label,
};
