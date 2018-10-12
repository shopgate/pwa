import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = css({
  background: colors.background,
  flexGrow: 1,
  paddingTop: variables.gap.xsmall,
  paddingBottom: variables.gap.xxbig,
}).toString();

export default {
  container,
};
