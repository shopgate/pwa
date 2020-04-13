// @flow
import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export const button = css({
  width: '100%',
  background: `var(--color-primary, ${colors.cta})`,
  color: `var(--color-primary-contrast, ${colors.ctaContrast})!important`,

}).toString();

export const disabledButton = css({
  width: '100%',
  background: colors.shade7,
  color: `${colors.shade4}!important`,
}).toString();
