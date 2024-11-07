import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

export const hint = css({
  fontSize: '0.75rem',
  color: `var(--color-text-medium-emphasis, ${themeConfig.colors.shade3})`,
});
