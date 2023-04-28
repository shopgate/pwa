import { connect } from 'react-redux';
import {
  getFavoritesProducts,
  getFavoritesLists,
  isInitialLoading,
} from '@shopgate/pwa-common-commerce/favorites/selectors';

/**
 * Maps state to props.
 * @param {Object} state State.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  products: getFavoritesProducts(state),
  lists: getFavoritesLists(state),
  initialLoading: isInitialLoading(state),
});

export default connect(mapStateToProps);
