import { connect } from 'react-redux';
import {
  addFavorites,
  removeFavorites,
} from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  addFavorites: productId => dispatch(addFavorites(productId)),
  removeFavorites: (productId, withRelatives) =>
    dispatch(removeFavorites(productId, withRelatives)),
});

export default connect(null, mapDispatchToProps, null, { pure: () => null });
