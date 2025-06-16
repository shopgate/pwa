import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const container = css({
  flexGrow: 1,
  paddingTop: variables.gap.xsmall,
  paddingBottom: variables.gap.xxbig,
}).toString();

export default {
  container,
};
