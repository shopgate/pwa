import { connect } from 'react-redux';
import { getFavoritesCount, isInitialLoading } from '@shopgate/engage/favorites';

/**
 * Maps state to props.
 * @param {Object} state State.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  hasFavorites: getFavoritesCount(state) > 0,
  initialLoading: isInitialLoading(state),
});

export default connect(mapStateToProps);
