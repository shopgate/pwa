import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const size = variables.gap.big * 1.125;

export default css({
  backgroundColor: colors.primary,
  borderRadius: size,
  color: colors.primaryContrast,
  fontSize: 12,
  fontWeight: 700,
  height: size,
  minWidth: size,
  padding: `0 ${variables.gap.small * 0.625}px`,
  position: 'absolute',
  right: 16,
  textAlign: 'center',
  top: 19,
});
