import React from 'react';
import PropTypes from 'prop-types';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export const MockedComponent = ({ children }) => (
  <div>
    {children}
  </div>
);

MockedComponent.propTypes = {
  children: PropTypes.node,
};
MockedComponent.defaultProps = {
  children: null,
};
