import { css } from 'glamor';
import variables from 'Styles/variables';
import colors from 'Styles/colors';

const container = css({
  padding: `${variables.gap.bigger}px ${variables.gap.big}px`,
}).toString();

const headline = css({
  fontSize: '1.125rem',
  fontWeight: 500,
}).toString();

const subline = css({
  color: colors.shade6,
}).toString();

const buttonWrapper = css({
  position: 'fixed',
  bottom: variables.gap.bigger,
  left: variables.gap.big,
  right: variables.gap.big,
}).toString();

const button = css({
  width: '100%',
}).toString();

export default {
  container,
  headline,
  subline,
  buttonWrapper,
  button,
};
