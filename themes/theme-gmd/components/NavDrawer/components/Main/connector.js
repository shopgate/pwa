import { connect } from 'react-redux';
import { isUserLoggedIn } from '@shopgate/pwa-common/selectors/user';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The application state.
 * @return {Object}
 */
const mapStateToProps = state => ({
  isLoggedIn: isUserLoggedIn(state),
});

export default connect(mapStateToProps, null);
