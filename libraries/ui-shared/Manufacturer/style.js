import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

export default css({
  // Before the custom properties the primary color was used for the rating stars.
  color: `var(--color-secondary, ${themeConfig.colors.primary})`,
}).toString();
