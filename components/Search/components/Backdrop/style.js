import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export default css({
  background: colors.background,
  bottom: 0,
  left: 0,
  position: 'absolute',
  right: 0,
  top: 0,
  width: '100%',
});
