import { connect } from 'react-redux';
import toggleNavDrawer from '../../actions/toggleNavDrawer';

/**
 * Maps action dispatchers to the component props.
 * @param {function} dispatch The store dispatcher.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  openNavDrawer: () => dispatch(toggleNavDrawer(true)),
});

export default connect(null, mapDispatchToProps);
