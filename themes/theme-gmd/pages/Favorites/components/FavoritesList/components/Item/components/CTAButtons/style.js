import { css } from 'glamor';
import variables from 'Styles/variables';

const ctaButtonWrapper = css({
  marginTop: `-${variables.gap.big}px`,
  marginLeft: variables.gap.big,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}).toString();

const cartButton = css({
  marginLeft: 22,
  marginRight: variables.gap.big,
}).toString();

export default {
  cartButton,
  ctaButtonWrapper,
};
