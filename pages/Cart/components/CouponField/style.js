import cxs from 'cxs';
import { colors, variables } from 'Templates/styles';

const easing = '450ms cubic-bezier(0.23, 1, 0.32, 1)';

const wrapper = cxs({
  background: colors.light,
  padding: variables.gap.big,
});

const container = cxs({
  position: 'relative',
  height: 24,
  width: '100%',
  fontSize: '0.875rem',
});

const icon = cxs({
  color: colors.primary,
  fontSize: '1.875rem',
  position: 'relative',
  float: 'right',
  top: -10,
  transition: `opacity ${easing}`,
});

const underlineWrapper = cxs({
  position: 'absolute',
  width: '100%',
  borderBottom: `1px solid ${colors.shade5}`,
  top: 24,
});

const underline = cxs({
  position: 'relative',
  width: '100%',
  top: 1,
  height: 2,
  willChange: 'transform',
  transition: `transform ${easing}`,
  background: colors.primary,
});

const underlineBlurred = cxs({
  transform: 'scale3d(0,1,1)',
});

const label = cxs({
  position: 'absolute',
  pointerEvents: 'none',
  bottom: 2,
  color: colors.shade4,
});

const input = cxs({
  position: 'absolute',
  width: 'calc(100% - 36px)',
  top: 0,
  outline: 0,
  bottom: 6,
});

export default {
  wrapper,
  container,
  icon,
  underlineWrapper,
  underline,
  underlineBlurred,
  label,
  input,
};
