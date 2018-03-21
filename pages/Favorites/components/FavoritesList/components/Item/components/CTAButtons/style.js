import { css } from 'glamor';
import variables from 'Styles/variables';

const ctaButtonWrapper = css({
  marginTop: `-${variables.gap.big}px`,
  paddingLeft: variables.gap.big,
  paddingRight: variables.gap.big,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}).toString();

export default {
  ctaButtonWrapper,
};
