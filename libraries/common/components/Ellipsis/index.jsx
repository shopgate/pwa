import React from 'react';
import PropTypes from 'prop-types';
import Dotdotdot from 'react-dotdotdot';

/**
 * The ellipsis text component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Ellipsis = props => (
  <Dotdotdot clamp={props.rows} ellipsis={props.ellipsis} className={props.className}>
    {props.children}
  </Dotdotdot>
);

Ellipsis.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  ellipsis: PropTypes.string,
  rows: PropTypes.number,
};

Ellipsis.defaultProps = {
  className: '',
  ellipsis: '...',
  rows: 3,
};

export default Ellipsis;
