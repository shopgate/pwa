import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const button = css({
  cursor: 'pointer',
  background: `var(--color-primary, ${colors.cta})`,
  color: `var(--color-primary-contrast, ${colors.ctaContrast})`,
  fontSize: 16,
  fontWeight: 700,
  borderRadius: 5,
  outline: 0,
  textAlign: 'center',
  transition: 'width 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  margin: '16px 0px 16px 16px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  padding: `${(variables.gap.big * 0.75) - 1}px ${variables.gap.big * 0.6}px ${(variables.gap.big * 0.75) + 1}px`,
});

const disabled = css(button, {
  background: colors.shade5,
  color: colors.light,
  cursor: 'not-allowed',
});

const icon = css({
  height: 32,
  marginTop: -24,
  marginRight: -24,
  '& svg': {
    fill: '#fff',
  },
});

export default {
  button,
  disabled,
  icon,
};
