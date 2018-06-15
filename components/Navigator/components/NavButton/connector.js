import { connect } from 'react-redux';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  showIconShadow: state.navigator.showIconShadow,
});

export default connect(mapStateToProps);
