import React from 'react';
import PropTypes from 'prop-types';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const MockView = ({ children }) => (
  <div>{children}</div>
);

MockView.propTypes = {
  children: PropTypes.node,
};

MockView.defaultProps = {
  children: null,
};
