import { connect } from 'react-redux';
import {
  getFavorites,
  getFavoritesLists,
  isInitialLoading,
  getFavoritesProductsIds,
} from '@shopgate/pwa-common-commerce/favorites/selectors';

/**
 * Maps state to props.
 * @param {Object} state State.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  products: getFavorites(state),
  favoriteProductIds: getFavoritesProductsIds(state),
  lists: getFavoritesLists(state),
  initialLoading: isInitialLoading(state),
});

export default connect(mapStateToProps);
