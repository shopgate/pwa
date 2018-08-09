import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const label = css({
  marginLeft: themeConfig.variables.gap.small,
  lineHeight: 1.6,
}).toString();

export default {
  label,
};
