import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

export default css({
  position: 'absolute',
  fontSize: '0.75rem',
  lineHeight: 1.4,
  fontWeight: 700,
  background: colors.primaryContrast,
  color: colors.primary,
  borderRadius: variables.gap.small,
  height: variables.gap.big,
  minWidth: variables.gap.big,
  paddingLeft: (variables.gap.small / 2),
  paddingRight: (variables.gap.small / 2),
  top: 12,
  right: 18,
  transform: 'translateX(50%)',
});
