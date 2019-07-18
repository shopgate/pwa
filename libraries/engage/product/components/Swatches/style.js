import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { typography } = themeConfig;

export const swatchesClass = css({
  marginTop: '8px',
  lineHeight: typography.lineHeight,
});
