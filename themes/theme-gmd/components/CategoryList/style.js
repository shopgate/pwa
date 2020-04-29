import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

const { colors, variables } = themeConfig;

export default css({
  background: colors.light,
});

export const image = css({
  display: 'none',
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    display: 'flex',
    ' img': {
      position: 'inherit',
      width: 'inherit !important',
      maxWidth: 'inherit !important',
      height: variables.gap.xxbig,
    },
  },
}).toString();
