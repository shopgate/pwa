import { connect } from 'react-redux';
import {
  getFavoritesCount,
} from '@shopgate/pwa-common-commerce/favorites/selectors';
import { getShowWishlistItemsCountBadge } from '@shopgate/engage/core/selectors/merchantSettings';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The application state.
 * @return {Object}
 */
const mapStateToProps = state => ({
  count: getFavoritesCount(state),
  showWishlistItemsCountBadge: getShowWishlistItemsCountBadge(state),
});

export default connect(mapStateToProps);
