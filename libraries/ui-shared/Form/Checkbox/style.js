import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const root = css({
  marginLeft: -2, // Removes margin caused by svg.
  '& svg': {
    float: 'left',
  },
}).toString();

const label = css({
  lineHeight: 1.6,
}).toString();

const labelWrapper = css({
  marginLeft: themeConfig.variables.gap.xbig,
}).toString();

const checked = css({
  color: `var(--color-primary, ${themeConfig.colors.primary})`,
}).toString();

export default {
  root,
  label,
  labelWrapper,
  checked,
};
