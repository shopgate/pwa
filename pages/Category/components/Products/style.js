import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

export const separator = css({
  margin: `${variables.gap.big}px 0 0 0`,
  borderTop: `1px solid ${colors.shade7}`,
  borderBottom: 'none',
});
