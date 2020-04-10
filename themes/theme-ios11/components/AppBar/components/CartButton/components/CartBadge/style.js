import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

export default css({
  position: 'absolute',
  fontSize: '0.7rem',
  lineHeight: 1.5,
  fontWeight: 700,
  background: `var(--color-primary, ${colors.primary})`,
  color: `var(--color-primary-contrast, ${colors.primaryContrast})`,
  borderRadius: variables.gap.small,
  height: variables.gap.big,
  minWidth: variables.gap.big,
  paddingLeft: (variables.gap.small / 2),
  paddingRight: (variables.gap.small / 2),
  top: 6,
  right: 4,
});
