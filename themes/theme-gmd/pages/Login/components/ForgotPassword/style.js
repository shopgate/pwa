import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export default css({
  color: `var(--color-text-low-emphasis, ${colors.shade6})`,
  position: 'relative',
  display: 'inline-block',
  width: 'auto',
  zIndex: '1',
}).toString();
