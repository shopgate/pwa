// @flow
import * as React from 'react';
import { isProductAvailable } from '../../helpers';
import { FulfillmentSheet } from '../FulfillmentSheet';
import connect from './CartChangeFulfillmentMethod.connector';
import { type OwnProps, type DispatchProps } from './CartChangeFulfillmentMethod.types';
import { type Location } from '../../locations.types';
import { STAGE_FULFILLMENT_METHOD } from '../../constants';

type Props = OwnProps & DispatchProps;

/**
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
function CartChangeFulfillmentMethod(props: Props) {
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

    registerAction('changeFulfillment', () => {
      fetchProductLocations(cartItem.product.id);
      setOpened(true);
    });
  }, [cartItem, fetchProductLocations, registerAction]);

  /**
   * Select location callback
   */
  const onLocationSelect = React.useCallback((location: Location | null) => {
    if (!location || !isProductAvailable(location)) {
      return;
    }

    updateProductInCart(cartItem.id, cartItem.quantity, location);
    setTimeout(() => setOpened(false), 500);
  }, [cartItem.id, cartItem.quantity, updateProductInCart]);

  if (!opened) {
    return null;
  }

  return (
    <FulfillmentSheet
      open
      productId={cartItem.product.id}
      onClose={onLocationSelect}
      stage={STAGE_FULFILLMENT_METHOD}
    />
  );
}

export default connect(CartChangeFulfillmentMethod);
