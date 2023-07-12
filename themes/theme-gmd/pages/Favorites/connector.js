import { connect } from 'react-redux';
import {
  getFavorites,
  getFavoritesLists,
  isInitialLoading,
} from '@shopgate/engage/favorites';

/**
 * Maps state to props.
 * @param {Object} state State.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  products: getFavorites(state),
  lists: getFavoritesLists(state),
  initialLoading: isInitialLoading(state),
});

export default connect(mapStateToProps);
