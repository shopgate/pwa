import { connect } from 'react-redux';
import toggleNavDrawer from '../../actions/toggleNavDrawer';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  showIconShadow: state.navigator.showIconShadow,
});

/**
 * Maps action dispatchers to the component props.
 * @param {function} dispatch The store dispatcher.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  toggleNavDrawer: active => dispatch(toggleNavDrawer(active)),
});

export default connect(mapStateToProps, mapDispatchToProps);
