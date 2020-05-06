import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const caption = css({
  fontSize: '0.75rem',
  lineHeight: '0.875rem',
  color: 'var(--color-text-low-emphasis)',
  paddingTop: variables.gap.xsmall,
});
