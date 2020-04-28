import { useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { addListener } from './listener';
import { parser } from './breakpoints';

const comparators = {
  '>=': (from, to, width) => width >= from,
  '>': (from, to, width) => width >= to,
  '<': (from, to, width) => width <= from,
  '<=': (from, to, width) => width <= to,
  '': (from, to, width) => width >= from && width <= to,
};

/**
 * Renders a responsive container that allows to render based on width.
 * @param {Object} props Component props.
 * @returns {React.Node}
 */
const ResponsiveContainer = ({
  breakpoint, webOnly, webAlways, appOnly, appAlways, children,
}) => {
  // Active breakpoint used for triggering rerenders on resize.
  const [activeBreakpoint, setActiveBreakpoint] = useState(null);

  // Calculate if should render due to visibility.
  /* eslint-disable react-hooks/exhaustive-deps */
  const breakpointSafe = useMemo(() => {
    const parsed = parser(comparators, breakpoint, {
      breakpoint,
      webOnly,
      webAlways,
      appOnly,
      appAlways,
    });

    return parsed;
  }, [activeBreakpoint, breakpoint]);
  /* eslint-enable react-hooks/exhaustive-deps */

  // Watch for resize changes.
  useEffect(() => addListener((newBreakpoint) => {
    setActiveBreakpoint(newBreakpoint);
  }), []);

  // Ignore rendering if one of given condition applies.
  if (!breakpointSafe) {
    return null;
  }

  return children;
};

ResponsiveContainer.propTypes = {
  appAlways: PropTypes.bool,
  appOnly: PropTypes.bool,
  breakpoint: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any,
  webAlways: PropTypes.bool,
  webOnly: PropTypes.bool,
};

ResponsiveContainer.defaultProps = {
  children: null,
  breakpoint: '>=xs',
  appAlways: false,
  webAlways: false,
  webOnly: false,
  appOnly: false,
};

export default ResponsiveContainer;
