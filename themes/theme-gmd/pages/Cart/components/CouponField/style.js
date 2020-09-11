import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export const container = css({
  background: `var(--color-background-accent, ${colors.shade7})`,
});
