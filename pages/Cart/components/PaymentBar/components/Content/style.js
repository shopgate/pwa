import { css } from 'glamor';
import variables from 'Styles/variables';

const container = css({
  padding: `${variables.gap.small}px`,
  lineHeight: 1.45,
  flexWrap: 'wrap',
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
  padding: `0 ${variables.gap.big}px 10px ${variables.gap.big}px`,
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
