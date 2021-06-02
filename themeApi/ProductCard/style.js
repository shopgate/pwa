import { css } from 'glamor';
import { themeShadows, themeColors } from '@shopgate/pwa-common/helpers/config';

export const shadowStyle = {
  boxShadow: themeShadows.productCard,
};

export const itemClass = css({
  background: themeColors.light,
  borderRadius: 2,
  overflow: 'hidden',
  position: 'relative',
});
