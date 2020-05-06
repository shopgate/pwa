import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export default css({
  color: `var(--color-text-medium-emphasis, ${colors.shade3})`,
  fontSize: 14,
}).toString();

