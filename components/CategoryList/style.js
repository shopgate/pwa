import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export default css({
  background: colors.light,
});

export const image = css({
  display: 'none',
}).toString();
