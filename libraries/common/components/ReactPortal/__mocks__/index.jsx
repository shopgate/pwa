import PropTypes from 'prop-types';

/**
 * Mock for ReactPortal to be used inside unit tests
 * @param {Object} props The component props
 * @returns {JSX}
 */
const ReactPortal = ({ children }) => children;

ReactPortal.propTypes = {
  children: PropTypes.node,
};

ReactPortal.defaultProps = {
  children: null,
};

export default ReactPortal;
