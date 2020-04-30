import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export const hint = css({
  display: 'block',
  color: colors.shade3,
  fontSize: 12,
}).toString();
