import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

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
});

const form = css({
  paddingTop: variables.gap.big * 1.5,
});

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
  color: `var(--color-primary, ${colors.primary})`,
  width: 'auto',
  margin: '-.35em 0 -.35em -.35em',
  padding: '.35em',
}).toString();

export default {
  container,
  headline,
  subline,
  form,
  input,
  forgotWrapper,
  buttonWrapper,
  button,
  noAccount,
  signup,
};
