import React from 'react';
import PropTypes from 'prop-types';
import Dotdotdot from 'react-dotdotdot';

/**
 * The ellipsis text component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Ellipsis = props => (
  <Dotdotdot
    clamp={props.rows}
    className={`${props.className} common__ellipsis`}
    useNativeClamp={props.useNativeClamp}
  >
    {props.children}
  </Dotdotdot>
);

Ellipsis.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  rows: PropTypes.number,
  /**
   * Whether to clamp via the browser's native `-webkit-line-clamp`. Defaults to `true`. That
   * requires `display: -webkit-box`, which mis-reports the element height in the WebView the app
   * runs in and lets following content overlap. Pass `false` to truncate the text in JS instead.
   */
  useNativeClamp: PropTypes.bool,
};

Ellipsis.defaultProps = {
  className: '',
  rows: 3,
  useNativeClamp: true,
};

export default Ellipsis;
