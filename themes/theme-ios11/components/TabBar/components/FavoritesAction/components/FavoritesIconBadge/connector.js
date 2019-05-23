import { connect } from 'react-redux';
import { getFavoritesCount } from '@shopgate/engage/favorites';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  favoritesCount: getFavoritesCount(state),
});

export default connect(mapStateToProps);
