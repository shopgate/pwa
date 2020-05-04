import { css } from 'glamor';

import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

export const caption = css({
  fontSize: '0.75rem',
  lineHeight: '0.875rem',
  color: colors.shade6,
  paddingTop: variables.gap.xsmall,
});
