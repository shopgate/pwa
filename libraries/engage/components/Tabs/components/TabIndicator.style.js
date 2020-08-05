import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export const root = css({
  position: 'absolute',
  height: 2,
  bottom: 0,
  width: '100%',
  transition: 'left .2s ease',
  backgroundColor: `var(--color-primary, ${colors.primary})`,
}).toString();

