import { connect } from 'react-redux';
import { getFavoritesItemsCount } from '@shopgate/pwa-common-commerce/favorites/selectors';
import { getShowWishlistItemsCountBadge } from '@shopgate/engage/core/selectors/merchantSettings';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  favoritesCount: getFavoritesItemsCount(state),
  showWishlistItemsCountBadge: getShowWishlistItemsCountBadge(state),
});

export default connect(mapStateToProps);
