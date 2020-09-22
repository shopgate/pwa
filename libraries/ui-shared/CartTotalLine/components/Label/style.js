import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const label = css({
  flexGrow: 1,
  paddingRight: variables.gap.small,
  order: 3,
}).toString();

const labelWithSuffix = css({
  paddingRight: variables.gap.small,
});

export default {
  label,
  labelWithSuffix,
};
