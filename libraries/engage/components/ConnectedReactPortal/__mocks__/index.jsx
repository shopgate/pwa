import PropTypes from 'prop-types';

/**
 * Mock for ConnectedReactPortal to be used inside unit tests
 * @param {Object} props The component props
 * @returns {JSX}
 */
const ConnectedReactPortal = ({ children, isOpened }) => (isOpened ? children : null);

ConnectedReactPortal.propTypes = {
  children: PropTypes.node,
};

ConnectedReactPortal.defaultProps = {
  children: null,
};

export default ConnectedReactPortal;
