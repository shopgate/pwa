import React from 'react';
import PropTypes from 'prop-types';

// Export context mock
export { ViewContext } from './context';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const MockedView = ({ children }) => (
  <div>{children}</div>
);

MockedView.propTypes = {
  children: PropTypes.node,
};

MockedView.defaultProps = {
  children: null,
};

export default MockedView;
