import PropTypes from 'prop-types';

/**
 * Mock for ConnectedReactPortal to be used inside unit tests
 * @param {Object} props The component props
 * @returns {JSX}
 */
const ConnectedReactPortal = ({ children, isOpened }) => (isOpened ? children : null);

ConnectedReactPortal.propTypes = {
  children: PropTypes.node,
  isOpened: PropTypes.bool,
};

ConnectedReactPortal.defaultProps = {
  children: null,
  isOpened: false,
};

export default ConnectedReactPortal;
