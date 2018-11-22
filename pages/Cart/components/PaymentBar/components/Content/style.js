import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = css({
  background: colors.light,
  boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
  lineHeight: 1.45,
  padding: `${variables.gap.big}px ${variables.gap.small}px`,
  position: 'relative',
  zIndex: 2,
}).toString();

const column = css({
  padding: `0 ${variables.gap.small}px`,
}).toString();

const labelColumn = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
}).toString();

const costsColumn = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
}).toString();

const buttonColumn = costsColumn;

const checkoutButton = css({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: 1,
}).toString();

export default {
  container,
  column,
  labelColumn,
  costsColumn,
  buttonColumn,
  checkoutButton,
};
