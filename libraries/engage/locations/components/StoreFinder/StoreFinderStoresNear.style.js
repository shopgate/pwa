import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const container = css({
  fontSize: '1.125rem',
  fontWeight: 500,
  color: 'var(--color-text-high-emphasis)',
  padding: `0 ${variables.gap.big}px ${variables.gap.small}px ${variables.gap.big}px`,
});
