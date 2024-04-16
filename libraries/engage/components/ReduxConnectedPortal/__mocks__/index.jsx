import PropTypes from 'prop-types';

/**
 * Mock for ReduxConnectedPortal to be used inside unit tests
 * @param {Object} props The component props
 * @returns {JSX}
 */
const ReduxConnectedPortal = ({ children, isOpened }) => (isOpened ? children : null);

ReduxConnectedPortal.propTypes = {
  children: PropTypes.node,
};

ReduxConnectedPortal.defaultProps = {
  children: null,
};

export default ReduxConnectedPortal;
