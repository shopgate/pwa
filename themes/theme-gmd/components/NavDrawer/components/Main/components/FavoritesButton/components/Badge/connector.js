import { connect } from 'react-redux';
import {
  getFavoritesItemsCount,
} from '@shopgate/pwa-common-commerce/favorites/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The application state.
 * @return {Object}
 */
const mapStateToProps = state => ({
  count: getFavoritesItemsCount(state),
});

export default connect(mapStateToProps);
