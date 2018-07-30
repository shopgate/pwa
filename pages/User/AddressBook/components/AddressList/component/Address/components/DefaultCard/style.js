import { css } from 'glamor';
import variables from 'Styles/variables';
import colors from 'Styles/colors';

const defaultAddress = css({
  color: colors.shade5,
  borderBottom: `1px solid ${colors.shade8}`,
  paddingTop: variables.gap.small,
  paddingBottom: variables.gap.small,
}).toString();

const setDefaultAddress = css({
  color: colors.primary,
  borderBottom: `1px solid ${colors.shade8}`,
  paddingTop: variables.gap.small,
  paddingBottom: variables.gap.small,
}).toString();

export default {
  defaultAddress,
  setDefaultAddress,
};
