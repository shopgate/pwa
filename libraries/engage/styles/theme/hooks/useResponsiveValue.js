import useTheme from './useTheme';
import useActiveBreakpoint from './useActiveBreakpoint';

// eslint-disable-next-line require-jsdoc
const useResponsiveValue = (values) => {
  const theme = useTheme();
  const active = useActiveBreakpoint();

  if (!active) return undefined;

  // Get the keys of the breakpoints in the theme
  const breakpoints = [...theme.breakpoints.keys];
  const activeIndex = breakpoints.indexOf(active);

  // Walk from the active breakpoint down to smallest
  for (let i = activeIndex; i >= 0; i -= 1) {
    const bp = breakpoints[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }

  return undefined;
};

export default useResponsiveValue;
