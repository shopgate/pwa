// @flow
import * as React from 'react';
import { Availability } from '@shopgate/engage/product';
import { RadioGroup } from '../../../components';
import { useFulfillmentState } from '../../locations.hooks';
import {
  PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP,
  PRODUCT_FULFILLMENT_METHOD_IN_STORE_PICKUP,
} from '../../constants';
import { StockInfo } from '../StockInfo';
import { container, pickUpContainer, radioGroup } from './FulfillmentPath.style';
import { FulfillmentPathItem } from './FulfillmentPathItem';

const directShip = 'product.fulfillment_selector.direct_ship';
const pickUp = 'product.fulfillment_selector.pick_up_in_store';

/**
 * Renders the fulfillment path selector stage.
 * @returns {JSX}
 */
export function FulfillmentPath() {
  const { product, meta, changeFulfillment } = useFulfillmentState();
  const cartItem = (meta && meta.cartItem) ? meta.cartItem : undefined;
  const isPickUp = !!(cartItem
    && (cartItem.fulfillment !== null && cartItem.fulfillment.method !== 'DIRECT_SHIP'));
  const [selection, setSelection] = React.useState(isPickUp ? pickUp : directShip);

  if (!product || !cartItem) {
    return null;
  }

  /**
 * @param {string} elementName The name of the selected element.
 */
  function handleChange(elementName) {
    const method = elementName === pickUp
      ? PRODUCT_FULFILLMENT_METHOD_IN_STORE_PICKUP
      : PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP;

    setSelection(elementName);
    changeFulfillment(method, cartItem);
  }

  return (
    <div className={container}>
      <RadioGroup
        name="cartItem.fulfillment_selector"
        value={selection}
        onChange={handleChange}
        className={radioGroup}
        isControlled
        direction="column"
      >
        <FulfillmentPathItem name={directShip}>
          <Availability
            productId={product.id}
            fulfillmentSelection={PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP}
          />
        </FulfillmentPathItem>
        <FulfillmentPathItem name={pickUp}>
          <div className={pickUpContainer}>
            {cartItem.fulfillment && (
              <StockInfo location={cartItem.fulfillment.location} />
            )}
          </div>
        </FulfillmentPathItem>
      </RadioGroup>
    </div>
  );
}
