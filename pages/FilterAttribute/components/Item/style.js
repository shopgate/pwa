import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const item = css({
  background: colors.light,
  marginBottom: variables.gap.small / 2,
  width: '100%',
}).toString();

const column = css({
  padding: '5px 0px',
  wordBreak: 'break-word',
}).toString();

export default {
  item,
  column,
};
