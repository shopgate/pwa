import { css } from 'glamor';
import colors from 'Styles/colors';

const baseIcon = {
  width: 24,
  height: 24,
};

const checkedIcon = css({
  ...baseIcon,
  color: colors.accent,
}).toString();

const uncheckedIcon = css({
  ...baseIcon,
  color: colors.shade6,
}).toString();

export default {
  checkedIcon,
  uncheckedIcon,
};
