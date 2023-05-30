import { connect } from 'react-redux';
import { getFavoritesCount } from '@shopgate/engage/favorites';
import { getShowWishlistItemsCountBadge } from '@shopgate/engage/core';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  favoritesCount: getFavoritesCount(state),
  showWishlistItemsCountBadge: getShowWishlistItemsCountBadge(state),
});

export default connect(mapStateToProps);
