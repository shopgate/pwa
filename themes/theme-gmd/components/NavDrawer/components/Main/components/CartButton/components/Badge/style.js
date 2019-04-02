import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

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
