import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const container = css({
  background: colors.background,
  flexGrow: 1,
  paddingTop: variables.gap.xsmall,
}).toString();

export default {
  container,
};
