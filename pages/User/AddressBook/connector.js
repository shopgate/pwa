import { connect } from 'react-redux';
import { isUserLoggedIn, getUserData } from '@shopgate/pwa-common/selectors/user';

/**
 * @param {Object} state state
 * @return {{hasAddresses: boolean}}
 */
const mapStateToProps = state => ({
  hasAddresses: isUserLoggedIn(state) ? !!getUserData(state).addresses.length : false,
});

export default connect(mapStateToProps);
