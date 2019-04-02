import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export default css({
  overflow: 'auto',
  padding: `0 ${variables.gap.small * 1.5}px`,
  width: '100%',
});
