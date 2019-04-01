import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export default css({
  bottom: 'var(--safe-area-inset-bottom)',
  left: 0,
  overflow: 'auto',
  position: 'absolute',
  right: 0,
  top: `calc(${variables.navigator.height}px + var(--safe-area-inset-top))`,
});
