import { connect } from 'react-redux';
import { updateProductsInCart } from '@shopgate/engage/cart';
import { fetchProductLocations } from '../../actions';

/**
 * @typedef {import('./CartItemProductChangeLocation.types').OwnProps} OwnProps
 * @typedef {import('./CartItemProductChangeLocation.types').DispatchProps} DispatchProps
 */

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @returns {DispatchProps} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  fetchProductLocations,
  updateProductInCart: (cartItemId, quantity, location, fulfillmentMethod) => {
    dispatch(updateProductsInCart([{
      cartItemId,
      quantity,
      fulfillment: {
        method: fulfillmentMethod,
        location: {
          code: location.code,
          name: location.name,
        },
      },
    }]));
  },
});

export default connect(null, mapDispatchToProps);
