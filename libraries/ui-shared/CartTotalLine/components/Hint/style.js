import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const hint = css({
  paddingLeft: variables.gap.small,
  order: 5,
}).toString();

export default {
  hint,
};
