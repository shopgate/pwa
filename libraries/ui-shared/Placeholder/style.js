import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors: { shade7 } } = themeConfig;

export default css({
  background: shade7,
  position: 'relative',
});
