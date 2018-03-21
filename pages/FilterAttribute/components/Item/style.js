import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const item = css({
  background: colors.light,
  marginBottom: variables.gap.small / 2,
  width: '100%',
}).toString();

const baseColumn = {
  display: 'block',
  padding: '5px 0px',
};

const label = css({
  ...baseColumn,
}).toString();

const checkbox = css({
  ...baseColumn,
}).toString();

export default {
  item,
  label,
  checkbox,
};
