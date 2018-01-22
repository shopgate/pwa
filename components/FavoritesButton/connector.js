import { connect } from 'react-redux';
import {
  addFavorites,
  removeFavorites,
} from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';
import { getCurrentProductId } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { isCurrentProductOnFavoriteList } from '@shopgate/pwa-common-commerce/favorites/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  active: isCurrentProductOnFavoriteList(state),
  productId: getCurrentProductId(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  addFavorites: productId => dispatch(addFavorites(productId)),
  removeFavorites: productId => dispatch(removeFavorites(productId)),
});

export default connect(mapStateToProps, mapDispatchToProps);
