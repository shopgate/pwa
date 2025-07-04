import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const container = css({
  flexGrow: 1,
  padding: `${variables.gap.small * 3}px ${variables.gap.big}px`,
}).toString();

const headline = css({
  fontSize: '2rem',
  lineHeight: 1.2,
  fontWeight: 700,
}).toString();

const subline = css({
  fontSize: '1.125rem',
  marginBottom: variables.gap.big * 1.5,
  marginTop: 4,
  color: `var(--color-text-medium-emphasis, ${colors.shade6})`,
});

const form = css({
  paddingTop: variables.gap.big * 1.5,
  '--form-element-left-offset': '30px',
});

const input = css({
  width: '100%',
  ' .simpleInput': {
    color: 'var(--color-text-high-emphasis)',
  },
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

const icon = css({
  fill: `var(--color-text-medium-emphasis, ${colors.shade6})`,
  width: '24px',
  height: '24px',
}).toString();

const iconLeft = css({
  marginRight: variables.gap.xsmall,
}).toString();

const iconRight = css({
  marginLeft: variables.gap.xsmall,
}).toString();

const toggleButton = css({
  padding: '4px',
  margin: '-4px 0',
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
  icon,
  iconLeft,
  iconRight,
  toggleButton,
};
