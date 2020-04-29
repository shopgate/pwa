import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

const { colors, variables } = themeConfig;

export default css({
  background: colors.light,
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    ' > li': {
      boxShadow: 'none !important',
      padding: `${variables.gap.small}px 0`,
      '&:first-child': {
        paddingTop: 0,
      },
      '&:last-child': {
        paddingBottom: 0,
      },
      '> :first-child': {
        border: `1px solid ${colors.shade7}`,
      },
    },
  },
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
