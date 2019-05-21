import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

export const hint = css({
  color: themeConfig.colors.success,
  fontSize: '0.875rem',
}).toString();
