import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const header = css({
  fontSize: '3rem',
  padding: `${variables.gap.big}px ${variables.gap.xbig}px`,
});
