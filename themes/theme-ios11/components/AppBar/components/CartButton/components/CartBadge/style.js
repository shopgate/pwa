import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

export default css({
  position: 'absolute',
  fontSize: '0.7rem',
  lineHeight: 1.5,
  fontWeight: 700,
  background: colors.primary,
  color: colors.primaryContrast,
  borderRadius: variables.gap.small,
  height: variables.gap.big,
  minWidth: variables.gap.big,
  paddingLeft: (variables.gap.small / 2),
  paddingRight: (variables.gap.small / 2),
  top: 6,
  right: 4,
});
