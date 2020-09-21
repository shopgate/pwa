import React from 'react';
import PropTypes from 'prop-types';

/**
 * @param {props} The component props
 * @returns {JSX}
 */
const Spacer = ({ children, className }) => (
  <div className={className}>
    {children}
  </div>
);

Spacer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Spacer.defaultProps = {
  children: null,
  className: null,
};

export default Spacer;
