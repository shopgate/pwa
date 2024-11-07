import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

export default css({
  color: `var(--color-primary, ${themeConfig.colors.primary})`,
}).toString();
