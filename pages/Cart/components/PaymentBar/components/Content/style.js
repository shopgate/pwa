import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = css({
  background: colors.light,
  boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
  padding: `${variables.gap.small}px`,
  lineHeight: 1.45,
  flexWrap: 'wrap',
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
}).toString();

const checkoutButtonContainer = css({
  background: colors.light,
  padding: `0 ${variables.gap.big}px 10px ${variables.gap.big}px`,
  position: 'relative',
  zIndex: 2,
}).toString();

export default {
  container,
  column,
  labelColumn,
  costsColumn,
  buttonColumn,
  checkoutButton,
  checkoutButtonContainer,
};
