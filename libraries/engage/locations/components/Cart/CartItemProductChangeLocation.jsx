import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import Fulfillment from '../Fulfillment/Fulfillment';
import { isProductAvailable } from '../../helpers';
import ProductLocations from '../Fulfillment/ProductLocations';
import connect from './CartItemProductChangeLocation.connector';

/**
 * @param {Object} cartItem cartItem
 * @param {Function} updateProduct updateProduct
 * @param {Function} fetchProductLocations fetchProductLocations
 * @returns {JSX}
 */
const CartItemProductChangeLocation = ({
  cartItem, updateProductInCart, fetchProductLocations, registerAction,
}) => {
  const [opened, setOpened] = useState(false);

  /** Register cart item action */
  useEffect(() => {
    if (!registerAction || !cartItem) {
      return;
    }
    registerAction('changeLocation', () => {
      fetchProductLocations(cartItem.product.id);
      setOpened(true);
    });
  }, [cartItem, registerAction, fetchProductLocations]);

  /** Select location callback */
  const onLocationSelect = useCallback((location) => {
    if (!location || !isProductAvailable(location)) {
      return;
    }
    updateProductInCart(cartItem.id, cartItem.quantity, location);
    setTimeout(() => setOpened(false), 500);
  }, [cartItem, updateProductInCart]);

  const { fulfillment } = cartItem;
  if (!opened || !fulfillment) {
    return null;
  }

  return (
    <Fulfillment opened title="locations.headline">
      <ProductLocations
        productId={cartItem.product.id}
        locationId={fulfillment.location.code}
        onLocationSelect={onLocationSelect}
      />
    </Fulfillment>
  );
};

CartItemProductChangeLocation.propTypes = {
  cartItem: PropTypes.shape().isRequired,
  fetchProductLocations: PropTypes.func,
  registerAction: PropTypes.func,
  updateProductInCart: PropTypes.func,
};

CartItemProductChangeLocation.defaultProps = {
  fetchProductLocations: noop,
  registerAction: noop,
  updateProductInCart: noop,
};

export default connect(CartItemProductChangeLocation);
