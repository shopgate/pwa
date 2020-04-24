import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export const list = css({
  borderTop: `1px solid ${colors.shade7}`,
  borderBottom: `1px solid ${colors.shade7}`,
});
