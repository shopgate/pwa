import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export const itemDetails = css({
  position: 'relative',
});

export default css({
  position: 'relative',
  display: 'block',
  background: colors.light,
  height: '100%',
}).toString();
