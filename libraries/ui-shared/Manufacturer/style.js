import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

export default css({
  // Before the custom properties the primary color was used for this class.
  color: `var(--color-primary, ${themeConfig.colors.secondary})`,
}).toString();
