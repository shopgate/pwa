import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const wrapper = css({
  background: colors.light,
  padding: `${variables.gap.small}px ${variables.gap.big}px`,
});

const wrapperCard = css(wrapper, {
  margin: `${variables.gap.small * 1.5}px ${variables.gap.small * 1.5}px ${variables.gap.big}px`,
  border: `1px solid ${colors.shade7}`,
  boxSizing: 'border-box',
  boxShadow: '0px 4px 2px rgba(0, 0, 0, 0.05)',
  borderRadius: 5,
});

const container = css({
  position: 'relative',
  width: '100%',
  fontSize: '0.875rem',
}).toString();

const label = css({
  position: 'absolute',
  pointerEvents: 'none',
  bottom: 2,
  color: colors.shade4,
}).toString();

const input = css({
  ' .errorText': {
    position: 'inherit',
    whiteSpace: 'inherit',
  },
}).toString();

const easing = '450ms cubic-bezier(0.23, 1, 0.32, 1)';

const icon = css({
  color: `var(--color-primary, ${colors.primary})`,
  fontSize: '1.875rem',
  position: 'absolute',
  transition: `opacity ${easing}`,
  cursor: 'pointer',
  top: 14,
  right: 0,
}).toString();

export default {
  wrapper,
  wrapperCard,
  container,
  label,
  input,
  icon,
};
