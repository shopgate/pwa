import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const leaf = css({
  fill: 'var(--color-primary)',
});

const background = css({
  fill: colors.light,
});

const shadow = css({
  fill: colors.shade10,
});

const basket = css({
  fill: 'var(--color-secondary)',
});

export default {
  background,
  shadow,
  leaf,
  basket,
};
