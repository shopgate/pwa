import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = css({
  background: colors.light,
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: variables.gap.big,
}).toString();

export default {
  container,
};
