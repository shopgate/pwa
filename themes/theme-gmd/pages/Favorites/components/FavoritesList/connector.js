import { connect } from 'react-redux';
import { getFavoritesCount, getFavoritesProductsIds } from '@shopgate/engage/favorites';

/**
 * Maps state to props.
 * @param {Object} state State.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  favoriteIds: getFavoritesProductsIds(state),
  favoritesCount: getFavoritesCount(state),
});

export default connect(mapStateToProps);
