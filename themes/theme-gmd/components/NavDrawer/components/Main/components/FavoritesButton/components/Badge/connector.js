import { connect } from 'react-redux';
import { hasFavorites, getFavoritesCount } from '@shopgate/pwa-common-commerce/favorites/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The application state.
 * @return {Object}
 */
const mapStateToProps = state => ({
  count: getFavoritesCount(state),
  visible: hasFavorites(state),
});

export default connect(mapStateToProps);
