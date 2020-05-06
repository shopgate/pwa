import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const buttonDefaults = {
  display: 'block',
  width: '100%',
  padding: `${variables.gap.small}px ${variables.gap.big}px`,
  fontFamily: 'inherit',
  textAlign: 'left',
  lineHeight: 1.2,
  outline: 'none',
  background: `var(--color-background-accent, ${colors.shade8})`,
  color: 'var(--color-text-high-emphasis)',
};

const button = css({
  ...buttonDefaults,
}).toString();

const buttonDisabled = css({
  ...buttonDefaults,
  color: colors.shade4,
}).toString();

const label = css({
  display: 'block',
  fontWeight: 500,
  ':not(:only-child)': {
    fontWeight: 400,
    fontSize: '0.75rem',
    marginBottom: 4,
  },
}).toString();

const value = css({
  display: 'block',
  fontWeight: 500,
}).toString();

export default {
  button,
  buttonDisabled,
  label,
  value,
};
