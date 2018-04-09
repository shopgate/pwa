import { css } from 'glamor';
import variables from 'Styles/variables';

const title = css({
  fontWeight: 500,
  lineHeight: 1.125,
  wordBreak: ['keep-all', 'break-word'],
  hyphens: 'auto',
}).toString();

const menuContainer = css({
  marginRight: `-${variables.gap.big}px`,
  marginLeft: variables.gap.big,
}).toString();

const menuToggleSize = variables.gap.big * 2;
const menuToggleFontSize = variables.gap.big * 1.5;

const menuToggle = css({
  height: menuToggleSize,
  width: menuToggleSize,
  marginTop: `-${variables.gap.small}px`,
  fontSize: menuToggleFontSize,
  padding: variables.gap.small * 0.5,
}).toString();

export default {
  title,
  menuContainer,
  menuToggle,
};
