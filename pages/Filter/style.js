import { css } from 'glamor';
import colors from 'Styles/colors';

const container = css({
  background: colors.background,
  flexGrow: 1,
  paddingTop: 4,
}).toString();

const filterContainer = css({
  background: colors.light,
}).toString();

const clearBtn = css({
  textAlign: 'right',
}).toString();

export default {
  container,
  filterContainer,
  clearBtn,
};
