import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const item = css({
  background: colors.light,
  marginBottom: variables.gap.small / 2,
  width: '100%',
}).toString();

const baseColumn = {
  overflow: 'hidden',
  padding: '5px 0px',
  textOverflow: 'ellipsis',
};

const labelColumn = css({
  overflow: 'hidden',
}).toString();

const label = css({
  ...baseColumn,
  marginRight: '1em',
}).toString();

const checkbox = css({
  ...baseColumn,
}).toString();

export default {
  item,
  labelColumn,
  label,
  checkbox,
};
