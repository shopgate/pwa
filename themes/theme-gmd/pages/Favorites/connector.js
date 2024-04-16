import { connect } from 'react-redux';
import {
  getFavoritesLists,
  getFavoritesCount,
  isInitialLoading,
  getHasMultipleFavoritesListsSupport,
} from '@shopgate/pwa-common-commerce/favorites/selectors';

/**
 * Maps state to props.
 * @param {Object} state State.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  favoritesCount: getFavoritesCount(state),
  lists: getFavoritesLists(state),
  initialLoading: isInitialLoading(state),
  hasMultipleFavoritesListsSupport: getHasMultipleFavoritesListsSupport(state),
});

export default connect(mapStateToProps);
