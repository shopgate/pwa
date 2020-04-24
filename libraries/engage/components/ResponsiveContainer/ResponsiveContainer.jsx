import { useMemo } from 'react';
import { hasWebBridge } from '@shopgate/engage/core';
import PropTypes from 'prop-types';
import breakpoints from './breakpoints';

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
  breakpoint, webOnly, appOnly, children,
}) => {
  const breakpointSafe = useMemo(() => {
    // Parse breakpoint prop into the comparator and the breakpoint name.
    const breakpointStart = breakpoint.search(/[a-zA-Z]/);
    const comparatorString = breakpoint.substring(0, breakpointStart === -1 ? 0 : breakpointStart);
    const breakpointString = breakpoint.substring(breakpointStart === -1 ? 0 : breakpointStart);

    // Get configuration.
    const comparator = comparators[comparatorString];
    const config = breakpoints.find(b => b.name === breakpointString);

    return comparator(config.from, config.to, window.innerWidth);
  }, [breakpoint]);

  const isWeb = hasWebBridge();

  if (!breakpointSafe || (appOnly && isWeb) || (webOnly && !isWeb)) {
    return null;
  }

  return children;
};

ResponsiveContainer.propTypes = {
  children: PropTypes.element.isRequired,
  appOnly: PropTypes.bool,
  breakpoint: PropTypes.string,
  webOnly: PropTypes.bool,
};

ResponsiveContainer.defaultProps = {
  breakpoint: '>=xs',
  webOnly: false,
  appOnly: false,
};

export default ResponsiveContainer;
