import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

export default css({
  position: 'absolute',
  background: `var(--color-primary, ${colors.primary})`,
  color: `var(--color-secondary-contrast, ${colors.light})`,
  fontSize: '0.7rem',
  lineHeight: 1.5,
  fontWeight: 'bold',
  borderRadius: variables.gap.small,
  display: 'block',
  right: 21,
  top: 20,
  height: variables.gap.big,
  paddingLeft: variables.gap.small / 2,
  paddingRight: variables.gap.small / 2,
  minWidth: variables.gap.big,
  transform: 'translateX(-50%)',
}).toString();

