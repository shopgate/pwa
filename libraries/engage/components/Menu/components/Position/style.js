import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const outerGap = themeConfig.variables.gap.small;

const container = css({
  position: 'absolute',
  margin: outerGap,
}).toString();

export default {
  container,
  outerGap,
};
