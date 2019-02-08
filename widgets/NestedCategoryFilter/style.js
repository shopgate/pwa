import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const container = css({
  background: colors.light,
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: variables.gap.big,
}).toString();

export default {
  container,
};
