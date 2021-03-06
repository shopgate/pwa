import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const container = css({
  transition: 'transform 400ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  willChange: 'transform',
});

const icon = css({
  boxSizing: 'content-box',
  padding: 16,
});

const iconCart = css(icon, {
  fill: colors.ctaContrast,
}).toString();

const iconTick = css(icon, {
  fill: colors.cta,
}).toString();

export default {
  container,
  iconCart,
  iconTick,
};
