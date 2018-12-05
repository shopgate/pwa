import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = css({
  flexGrow: 1,
  padding: `${variables.gap.small * 3}px ${variables.gap.big}px`,
}).toString();

const headline = css({
  fontSize: '2.1875rem',
  lineHeight: 1,
  fontWeight: 500,
}).toString();

const subline = css({
  fontSize: '1.125rem',
  color: colors.shade6,
  marginBottom: variables.gap.big,
  marginTop: 4,
}).toString();

const padLine = css({
  marginBottom: variables.gap.xxbig - variables.gap.big,
}).toString();

const input = css({
  width: '100%',
}).toString();

const forgotWrapper = css({
  textAlign: 'right',
  fontSize: '0.75rem',
  marginTop: -variables.gap.big,
  marginBottom: variables.gap.big,
}).toString();

const buttonWrapper = css({
  paddingTop: variables.gap.big * 2,
  paddingBottom: variables.gap.big * 1.5,
}).toString();

const button = css({
  width: '100%',
}).toString();

const noAccount = css({
  marginRight: variables.gap.small * 0.5,
}).toString();

const signup = css({
  display: 'inline-block',
  color: colors.primary,
  width: 'auto',
  margin: '-.35em 0 -.35em -.35em',
  padding: '.35em',
}).toString();

export default {
  container,
  headline,
  subline,
  input,
  forgotWrapper,
  buttonWrapper,
  button,
  noAccount,
  signup,
  padLine,
};
