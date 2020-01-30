import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const sheet = css({
  maxHeight: `calc(100vh - ${variables.navigator.height}px)`,
});
