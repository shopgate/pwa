import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const root = css({
  '& svg': {
    float: 'left',
  },
}).toString();

const label = css({
  marginLeft: themeConfig.variables.gap.small,
  lineHeight: 1.6,
}).toString();

export default {
  root,
  label,
};
