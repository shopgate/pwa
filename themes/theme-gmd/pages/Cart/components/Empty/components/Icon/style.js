import { css } from 'glamor';
import colors from 'Styles/colors';

const leaf = css({
  fill: colors.primary,
});

const background = css({
  fill: colors.light,
});

const shadow = css({
  fill: colors.shade10,
});

const basket = css({
  fill: colors.accent,
});

export default {
  background,
  shadow,
  leaf,
  basket,
};
