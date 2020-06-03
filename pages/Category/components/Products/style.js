import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export const separator = css({
  margin: 0,
  borderTop: `1px solid ${colors.shade7}`,
  borderBottom: 'none',
});
