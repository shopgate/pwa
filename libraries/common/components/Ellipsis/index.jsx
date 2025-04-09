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
    useNativeClamp
  >
    {props.children}
  </Dotdotdot>
);

Ellipsis.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  rows: PropTypes.number,
};

Ellipsis.defaultProps = {
  className: '',
  rows: 3,
};

export default Ellipsis;
