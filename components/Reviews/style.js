import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const container = css({
  marginBottom: variables.gap.small,
});

export default {
  container,
};
