// @flow
import * as React from 'react';
import { FulfillmentSheet } from '../FulfillmentSheet';
import connect from './CartChangeFulfillmentMethod.connector';
import { type OwnProps, type DispatchProps } from './CartChangeFulfillmentMethod.types';
import { STAGE_FULFILLMENT_METHOD } from '../../constants';

type Props = OwnProps & DispatchProps;

/**
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
function CartChangeFulfillmentMethod(props: Props) {
  const {
    cartItem, fetchProductLocations, registerAction,
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
   * Handles closing of the sheet.
   */
  function handleClose() {
    setOpened(false);
  }

  if (!opened) {
    return null;
  }

  return (
    <FulfillmentSheet
      open
      productId={cartItem.product.id}
      stage={STAGE_FULFILLMENT_METHOD}
      meta={{ cartItem }}
      onClose={handleClose}
    />
  );
}

export default connect(CartChangeFulfillmentMethod);
