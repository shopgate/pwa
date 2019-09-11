import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { shadows } = themeConfig;

export const shadowStyle = {
  boxShadow: shadows.productCard,
};

export const itemClass = css({
  background: '#fff',
  borderRadius: 2,
  overflow: 'hidden',
  position: 'relative',
});
