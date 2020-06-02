import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const listView = css({
  background: colors.light,
  overflow: 'auto',
  '> ul > li:first-child': {
    paddingTop: 0,
  },
  '> ul > li:last-child': {
    paddingBottom: 0,
  },
}).toString();

const gridView = css({
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    ' > ul': {
      paddingTop: 0,
    },
  },
});

export default {
  listView,
  gridView,
};
