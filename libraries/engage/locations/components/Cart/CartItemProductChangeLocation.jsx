// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import { FulfillmentSheet } from '../FulfillmentSheet';
import { isProductAvailable } from '../../helpers';
import { STAGE_SELECT_STORE } from '../../constants';
import connect from './CartItemProductChangeLocation.connector';
import { type OwnProps, type DispatchProps } from './CartItemProductChangeLocation.types';
import { type Location } from '../../locations.types';

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

  /**
   * Register cart item action
   */
  React.useEffect(() => {
    if (!registerAction || !cartItem) {
      return;
    }

    registerAction('changeLocation', () => {
      fetchProductLocations(cartItem.product.id);
      setOpened(true);
    });
  }, [cartItem, fetchProductLocations, registerAction]);

  /**
   * Select location callback
   */
  const onLocationSelect = React.useCallback((location: Location | null) => {
    setTimeout(() => setOpened(false), 500);
    if (!location || !isProductAvailable(location)) {
      return;
    }
    updateProductInCart(cartItem.id, cartItem.quantity, location);
  }, [cartItem.id, cartItem.quantity, updateProductInCart]);

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
      onClose={onLocationSelect}
    />
  );
};

CartItemProductChangeLocation.defaultProps = {
  registerAction: noop,
};

export default connect(CartItemProductChangeLocation);
