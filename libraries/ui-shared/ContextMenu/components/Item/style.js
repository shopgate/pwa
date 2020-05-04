import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const item = css({
  position: 'relative',
  whiteSpace: 'nowrap',
  padding: `${themeConfig.variables.gap.big * 0.875}px ${themeConfig.variables.gap.big * 1.375}px`,
  lineHeight: 1,
  zIndex: 1,
  cursor: 'pointer',
  ':hover': {
    background: themeConfig.colors.shade8,
  },
}).toString();

export default { item };
