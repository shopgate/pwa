import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const label = css({
  paddingLeft: themeConfig.variables.gap.small,
  paddingTop: 2,
  fontSize: '0.875rem',
}).toString();

export default {
  label,
};
