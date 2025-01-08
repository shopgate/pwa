import { connect } from 'react-redux';
import {
  toggleFavoriteWithListChooser,
} from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';
import {
  getLoadWishlistOnAppStartEnabled,
  getWishlistItemQuantityEnabled,
} from '@shopgate/engage/core/selectors/shopSettings';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => state => ({
  wishlistItemQuantityEnabled: getWishlistItemQuantityEnabled(state),
  loadWishlistOnAppStartEnabled: getLoadWishlistOnAppStartEnabled(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  addFavorites: productId => dispatch(toggleFavoriteWithListChooser(productId)),
  removeFavorites: (productId, withRelatives) =>
    dispatch(toggleFavoriteWithListChooser(productId, withRelatives)),
});

export default connect(makeMapStateToProps, mapDispatchToProps);
