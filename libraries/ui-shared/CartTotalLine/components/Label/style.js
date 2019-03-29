import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const label = css({
  flexGrow: 1,
  paddingRight: variables.gap.small,
}).toString();

export default {
  label,
};
