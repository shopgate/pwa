// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import Fulfillment from '../Fulfillment/Fulfillment';
import { isProductAvailable } from '../../helpers';
import ProductLocations from '../Fulfillment/ProductLocations';
import connect from './CartItemProductChangeLocation.connector';
import { type OwnProps, type DispatchProps } from './CartItemProductChangeLocation.types';

type Props = OwnProps & DispatchProps;

/**
 * @param {Object} props The component props.
 * @param {Object} cartItem cartItem
 * @param {Function} updateProduct updateProduct
 * @param {Function} fetchProductLocations fetchProductLocations
 * @returns {JSX}
 */
const CartItemProductChangeLocation = (props: Props) => {
  const {
    cartItem, updateProductInCart, fetchProductLocations, registerAction,
  } = props;
  const [opened, setOpened] = React.useState(false);

  /** Register cart item action */
  React.useEffect(() => {
    if (!registerAction || !cartItem) {
      return;
    }
    registerAction('changeLocation', () => {
      fetchProductLocations(cartItem.product.id);
      setOpened(true);
    });
  }, [cartItem, fetchProductLocations, registerAction]);

  /** Select location callback */
  const onLocationSelect = React.useCallback((location) => {
    if (!location || !isProductAvailable(location)) {
      return;
    }
    updateProductInCart(cartItem.id, cartItem.quantity, location);
    setTimeout(() => setOpened(false), 500);
  }, [cartItem.id, cartItem.quantity, updateProductInCart]);

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

CartItemProductChangeLocation.defaultProps = {
  registerAction: noop,
};

export default connect(CartItemProductChangeLocation);
