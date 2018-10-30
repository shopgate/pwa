import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const subHeader = css({
  color: colors.shade3,
  fontSize: '0.875rem',
  marginLeft: variables.gap.big,
}).toString();

export default {
  subHeader,
};
