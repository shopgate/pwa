import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export default css({
  background: colors.primary,
  borderRadius: '50%',
  content: ' ',
  display: 'block',
  height: 8,
  position: 'absolute',
  right: 21,
  top: 23,
  width: 8,
});
