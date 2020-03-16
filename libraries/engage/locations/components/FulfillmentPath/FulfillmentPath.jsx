// @flow
import * as React from 'react';
import { Availability } from '@shopgate/engage/product';
import { RadioGroup } from '../../../components';
import { useFulfillmentState } from '../../locations.hooks';
import {
  DIRECT_SHIP,
  DIRECT_SHIP_LABEL,
  IN_STORE_PICKUP,
  IN_STORE_PICKUP_LABEL,
} from '../../constants';
import { StockInfo } from '../StockInfo';
import { container, pickUpContainer, radioGroup } from './FulfillmentPath.style';
import { FulfillmentPathItem } from './FulfillmentPathItem';

/**
 * Renders the fulfillment path selector stage.
 * @returns {JSX}
 */
export function FulfillmentPath() {
  const { product, meta: { cartItem = undefined } = {}, changeFulfillment } = useFulfillmentState();
  const { fulfillment } = cartItem || {};
  const isPickUp = !!(cartItem && (fulfillment !== null && fulfillment.method !== 'DIRECT_SHIP'));
  const [selection, setSelection] = React.useState(
    isPickUp ? IN_STORE_PICKUP_LABEL : DIRECT_SHIP_LABEL
  );

  if (!product || !cartItem) {
    return null;
  }

  /**
 * @param {string} elementName The name of the selected element.
 */
  function handleChange(elementName) {
    const method = (elementName === IN_STORE_PICKUP_LABEL) ? IN_STORE_PICKUP : DIRECT_SHIP;

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
        <FulfillmentPathItem name={DIRECT_SHIP_LABEL}>
          <Availability productId={product.id} fulfillmentSelection={DIRECT_SHIP} />
        </FulfillmentPathItem>
        <FulfillmentPathItem name={IN_STORE_PICKUP_LABEL}>
          <div className={pickUpContainer}>
            {fulfillment && (
              <StockInfo location={fulfillment.location} />
            )}
          </div>
        </FulfillmentPathItem>
      </RadioGroup>
    </div>
  );
}
