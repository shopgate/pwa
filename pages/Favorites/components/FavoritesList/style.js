import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = css({
  background: colors.light,
  paddingTop: variables.gap.xsmall,
  paddingBottom: variables.gap.xsmall,
  marginBottom: variables.gap.xxbig, // Place for snackbar.
}).toString();

export default {
  container,
};
