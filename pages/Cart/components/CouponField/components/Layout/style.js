import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const wrapper = css({
  background: colors.light,
  padding: variables.gap.big,
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
  height: 24,
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
  position: 'absolute',
  width: 'calc(100% - 36px)',
  top: 0,
  outline: 0,
  bottom: 6,
  padding: 0,
  left: 0,
}).toString();

const easing = '450ms cubic-bezier(0.23, 1, 0.32, 1)';

const icon = css({
  color: colors.primary,
  fontSize: '1.875rem',
  position: 'relative',
  float: 'right',
  top: -10,
  transition: `opacity ${easing}`,
}).toString();

const underlineWrapper = css({
  position: 'absolute',
  width: '100%',
  borderBottom: `1px solid ${colors.shade5}`,
  top: 24,
}).toString();

const underline = css({
  position: 'relative',
  width: '100%',
  top: 1,
  height: 2,
  willChange: 'transform',
  transition: `transform ${easing}`,
  background: colors.primary,
}).toString();

const underlineBlurred = css({
  transform: 'scale3d(0,1,1)',
}).toString();

export default {
  wrapper,
  wrapperCard,
  container,
  label,
  input,
  icon,
  underline,
  underlineWrapper,
  underlineBlurred,
};
