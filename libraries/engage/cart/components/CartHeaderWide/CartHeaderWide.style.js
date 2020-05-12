import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const header = css({
  fontSize: '2.125rem',
  lineHeight: '2.25rem',
  padding: variables.gap.xbig,
});
