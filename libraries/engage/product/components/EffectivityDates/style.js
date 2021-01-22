import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

export const hint = css({
  color: `var(--color-state-ok, ${themeConfig.colors.success})`,
  fontSize: '0.75rem',
}).toString();

export const notAvailable = css({
  color: `var(--color-state-alert, ${themeConfig.colors.error})`,
  fontSize: '0.75rem',
}).toString();
