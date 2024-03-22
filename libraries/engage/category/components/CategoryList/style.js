import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const sheet = css({
  background: colors.light,
}).toString();

const showAllProducts = css({
  fontWeight: 800,
}).toString();

export default {
  sheet,
  showAllProducts,
};
