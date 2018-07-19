import { css } from 'glamor';
import variables from 'Styles/variables';

const container = css({
  padding: `${variables.gap.bigger}px ${variables.gap.big}px`,
}).toString();

const headline = css({
  fontSize: '1.125rem',
  fontWeight: 500,
  marginBottom: variables.gap.bigger,
}).toString();

const buttonWrapper = css({
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100%',
}).toString();

const button = css({
  width: '100%',
}).toString();

export default {
  container,
  headline,
  buttonWrapper,
  button,
};
