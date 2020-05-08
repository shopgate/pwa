import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables, colors } = themeConfig;

export const container = css({
  overflow: 'auto',
  padding: `0 ${variables.gap.small * 1.5}px`,
  width: '100%',
});

export const label = css({
  color: `var(--color-text-high-emphasis, ${colors.accent})`,
});
