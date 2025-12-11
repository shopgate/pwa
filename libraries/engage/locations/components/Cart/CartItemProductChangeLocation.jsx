import noop from 'lodash/noop';
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FulfillmentSheet } from '../FulfillmentSheet';
import { isProductAvailable } from '../../helpers';
import { STAGE_SELECT_STORE } from '../../constants';
import connect from './CartItemProductChangeLocation.connector';

/**
 * @typedef {import('./CartItemProductChangeLocation.types').OwnProps} OwnProps
 * @typedef {import('./CartItemProductChangeLocation.types').DispatchProps} DispatchProps
 */

/**
 * @typedef {OwnProps & DispatchProps} Props
 */

/**
 * @param {Props} props The component props.
 * @returns {JSX.Element|null}
 */
const CartItemProductChangeLocation = (props) => {
  const {
    cartItem, updateProductInCart, fetchProductLocations, registerAction,
  } = props;
  const [opened, setOpened] = useState(false);
  const [fulfillmentMethod, setFulfillmentMethod] = useState(null);

  /**
   * Register cart item action
   */
  useEffect(() => {
    if (!registerAction || !cartItem) {
      return;
    }

    registerAction('changeLocation', (currentFulfillmentMethod) => {
      fetchProductLocations(cartItem.product.id);
      setOpened(true);
      setFulfillmentMethod(currentFulfillmentMethod);
    });
  }, [cartItem, fetchProductLocations, registerAction]);

  /**
   * Select location callback
   * @param {Object|null} location
   */
  const onLocationSelect = useCallback((location) => {
    setTimeout(() => setOpened(false), 500);
    if (!location || !isProductAvailable(location, location?.inventory)) {
      return;
    }
    updateProductInCart(cartItem.id, cartItem.quantity, location, fulfillmentMethod);
    setFulfillmentMethod(fulfillmentMethod);
  }, [cartItem.id, cartItem.quantity, fulfillmentMethod, updateProductInCart]);

  const { fulfillment } = cartItem;

  if (!opened || !fulfillment) {
    return null;
  }

  return (
    <FulfillmentSheet
      stage={STAGE_SELECT_STORE}
      open
      title="locations.headline"
      changeOnly
      productId={cartItem.product.id}
      updatePreferredLocation
      onClose={onLocationSelect}
      isCart
    />
  );
};

CartItemProductChangeLocation.propTypes = {
  cartItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    fulfillment: PropTypes.shape(),
    product: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  fetchProductLocations: PropTypes.func.isRequired,
  updateProductInCart: PropTypes.func.isRequired,
  registerAction: PropTypes.func,
};

CartItemProductChangeLocation.defaultProps = {
  registerAction: noop,
};

export default connect(CartItemProductChangeLocation);
