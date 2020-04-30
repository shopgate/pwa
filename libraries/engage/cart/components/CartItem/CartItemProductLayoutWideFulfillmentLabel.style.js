import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export const label = css({
  color: `var(--color-secondary, ${colors.accent})`,
  fontSize: '0.875rem',
  marginTop: 'auto',
});
