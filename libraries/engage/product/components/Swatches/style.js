import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { typography } = themeConfig;

export const swatches = css({
  marginTop: '8px',
  lineHeight: typography.lineHeight,
});
