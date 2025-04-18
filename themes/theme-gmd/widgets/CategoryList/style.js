import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const container = css({
  background: colors.light,
}).toString();

const sheetList = css({
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

const grid = css({
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    marginTop: variables.gap.big,
    paddingBottom: 0,
  },
}).toString();

const image = css({
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

export default {
  container,
  sheetList,
  image,
  grid,
};
