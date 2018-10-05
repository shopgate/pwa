import { connect } from 'react-redux';
import { isUserLoggedIn } from '@shopgate/pwa-common/selectors/user';
import logout from '@shopgate/pwa-common/actions/user/logout';
import { getMenuById } from '@shopgate/pwa-common/selectors/menu';
import { QUICKLINKS_MENU } from '@shopgate/pwa-common/constants/MenuIDs';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  user: isUserLoggedIn(state) ? state.user.data : null,
  isLoggedIn: isUserLoggedIn(state),
  entries: {
    quicklinks: getMenuById(state, QUICKLINKS_MENU).entries,
  },
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param  {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true });
