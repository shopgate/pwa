import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const button = css({
  position: 'absolute',
  right: 0,
  top: 0,
  display: 'block',
  flexGrow: 1,
  background: `var(--color-primary, ${colors.cta})`,
  color: `var(--color-primary-contrast, ${colors.ctaContrast})`,
  fontSize: 16,
  fontWeight: 700,
  borderRadius: 5,
  width: '100%',
  outline: 0,
  transition: 'width 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  padding: `${(variables.gap.big * 0.75) - 1}px ${variables.gap.big * 0.6}px ${(variables.gap.big * 0.75) + 1}px`,
  ':disabled': {
    cursor: 'not-allowed',
  },
});

const disabled = css(button, {
  background: colors.shade5,
  color: colors.light,
});

export default {
  button,
  disabled,
};
