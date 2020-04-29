import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

const { variables } = themeConfig;

export const sheet = css({
  maxHeight: `calc(100vh - ${variables.navigator.height}px)`,
  [responsiveMediaQuery('>sm', { webOnly: true })]: {
    maxHeight: `calc(80vh - ${variables.navigator.height}px)`,
  },
});
