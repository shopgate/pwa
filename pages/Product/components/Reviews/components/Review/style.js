import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const review = css({
  padding: `${variables.gap.big}px 0`,
  borderTop: `1px solid ${colors.shade7}`,
}).toString();

export default {
  review,
};
