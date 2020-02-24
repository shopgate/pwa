// @flow
import * as Redux from 'redux';
import { connect } from 'react-redux';
import { updateProductsInCart } from '@shopgate/engage/cart';
import { PRODUCT_FULFILLMENT_METHOD_ROPIS } from '../../constants';
import { fetchProductLocations } from '../../actions';
import { type OwnProps, type DispatchProps } from './CartItemProductChangeLocation.types';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = (dispatch: Redux.Dispatch<any>): DispatchProps => ({
  fetchProductLocations,
  updateProductInCart: (cartItemId, quantity, location) => (
    dispatch(updateProductsInCart([{
      cartItemId,
      quantity,
      fulfillment: {
        method: PRODUCT_FULFILLMENT_METHOD_ROPIS,
        location: {
          code: location.code,
          name: location.name,
        },
      },
    }]))
  ),
});

export default connect<null, DispatchProps, OwnProps>(null, mapDispatchToProps);
