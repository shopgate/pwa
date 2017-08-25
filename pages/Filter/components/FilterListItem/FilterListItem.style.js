import cxs from 'cxs';
import { colors, variables } from 'Templates/styles';

const item = cxs({
  background: colors.light,
  position: 'relative',
});

const label = cxs({
  display: 'block',
  padding: `${Math.round(variables.gap.big * 0.8)}px ${variables.gap.big}px`,
});

const gridItem = cxs({
  minWidth: '50%',
});

const cross = cxs({
  width: 50,
  height: 50,
  position: 'absolute',
  top: 0,
  right: 0,
  zIndex: 1,
  fontSize: '1.5rem',
  color: colors.accent,
  lineHeight: 1,
  outline: 0,
  padding: 0,
});

const crossIcon = cxs({
  margin: 'auto',
});

const ripple = cxs({
  display: 'flex',
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
});

const rightContainer = cxs({
  ...gridItem,
  justifyContent: 'flex-end',
  paddingRight: 50,
  overflow: 'hidden',
});

export default {
  item,
  label,
  gridItem,
  cross,
  crossIcon,
  ripple,
  rightContainer,
};
