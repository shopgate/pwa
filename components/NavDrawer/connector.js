import { connect } from 'react-redux';
import { getCartProductDisplayCount } from '@shopgate/pwa-common-commerce/cart/selectors';
import { hasFavorites } from '@shopgate/pwa-common-commerce/favorites/selectors';
import logout from '@shopgate/pwa-common/actions/user/logout';
import { isUserLoggedIn } from '@shopgate/pwa-common/selectors/user';
import toggleNavDrawer from 'Components/Navigator/actions/toggleNavDrawer';
import { getMenuById } from './selectors';
import { QUICKLINKS_MENU } from './constants';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  cartProductCount: getCartProductDisplayCount(state),
  entries: {
    quicklinks: getMenuById(state, { id: QUICKLINKS_MENU }).entries,
  },
  highlightFavorites: hasFavorites(state),
  navDrawerActive: state.navigator.navDrawerActive,
  user: isUserLoggedIn(state) ? state.user.data : null,
});

/**
 * Maps action dispatchers to the component props.
 * @param {function} dispatch The store dispatcher.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  toggleNavDrawer: active => dispatch(toggleNavDrawer(active)),
});

export default connect(mapStateToProps, mapDispatchToProps);
