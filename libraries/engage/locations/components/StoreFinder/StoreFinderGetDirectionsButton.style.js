import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export const container = css({

}).toString();

export const button = css({
  width: '100%',
  background: `var(--color-primary, ${colors.primary})!important`,
  color: `var(--color-primary-contrast, ${colors.primaryContrast})!important`,
  fontSize: '0.875rem !important',
}).toString();
