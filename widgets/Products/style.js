import { css } from 'glamor';
import colors from 'Styles/colors';

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

export default {
  listView,
};
