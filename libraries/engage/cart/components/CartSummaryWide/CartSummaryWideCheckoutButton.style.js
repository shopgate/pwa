import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

export const button = css({
  width: '100%',
  background: `var(--color-primary, ${colors.cta})`,
  color: `var(--color-primary-contrast, ${colors.ctaContrast})!important`,
  borderRadius: 4,
  margin: `${variables.gap.big}px 0`,
}).toString();

export const disabledButton = css({
  background: colors.shade7,
  color: `${colors.shade4}!important`,
}).toString();
