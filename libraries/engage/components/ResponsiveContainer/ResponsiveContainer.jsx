import PropTypes from 'prop-types';
import { useResponsiveValue } from './hooks';

/**
 * Renders a responsive container that allows to render based on width.
 * @param {Object} props Component props.
 * @returns {React.Node}
 */
const ResponsiveContainer = ({
  breakpoint, webOnly, webAlways, appOnly, appAlways, children,
}) => {
  const render = useResponsiveValue(breakpoint, {
    webOnly,
    webAlways,
    appOnly,
    appAlways,
  });

  if (!render) {
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
