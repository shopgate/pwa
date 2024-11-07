import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const sheet = css({
  background: colors.light,
}).toString();

const showAllProducts = css({
  fontWeight: 700,
}).toString();

const image = css({
  display: 'none',
  background: 'red',
  borderRadius: 20,
}).toString();

export default {
  sheet,
  showAllProducts,
  image,
};
