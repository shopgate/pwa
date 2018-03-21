import { connect } from 'react-redux';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  path: state.history.pathname,
});

export default connect(mapStateToProps, null);
