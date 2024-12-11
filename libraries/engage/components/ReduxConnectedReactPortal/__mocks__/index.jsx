import PropTypes from 'prop-types';

/**
 * Mock for ReduxConnectedReactPortal to be used inside unit tests
 * @param {Object} props The component props
 * @returns {JSX}
 */
const ReduxConnectedReactPortal = ({ children, isOpened }) => (isOpened ? children : null);

ReduxConnectedReactPortal.propTypes = {
  children: PropTypes.node,
};

ReduxConnectedReactPortal.defaultProps = {
  children: null,
};

export default ReduxConnectedReactPortal;
