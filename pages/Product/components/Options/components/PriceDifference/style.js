import { css } from 'glamor';
import colors from 'Styles/colors';

const positive = css({
  color: colors.shade4,
  ':before': {
    content: '"+"',
  },
}).toString();

const negative = css({
  color: colors.primary,
}).toString();

export default {
  positive,
  negative,
};
