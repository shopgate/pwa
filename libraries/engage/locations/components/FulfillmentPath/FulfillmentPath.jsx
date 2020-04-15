import React, { useState, useCallback } from 'react';
import { Availability } from '@shopgate/engage/product';
import { RadioGroup } from '../../../components';
import { useFulfillmentState } from '../../locations.hooks';
import {
  IN_STORE_PICKUP_BOPIS_LABEL,
  IN_STORE_PICKUP_ROPIS_LABEL,
  DIRECT_SHIP_LABEL,
  DIRECT_SHIP,
  ROPIS,
  BOPIS,
} from '../../constants';
import { container, radioGroup } from './FulfillmentPath.style';
import { FulfillmentPathItem } from './FulfillmentPathItem';

/**
 * Renders the fulfillment path selector stage.
 * @returns {JSX}
 */
export function FulfillmentPath() {
  const labelMapping = {
    [DIRECT_SHIP]: DIRECT_SHIP_LABEL,
    [ROPIS]: IN_STORE_PICKUP_ROPIS_LABEL,
    [BOPIS]: IN_STORE_PICKUP_BOPIS_LABEL,
  };

  const {
    product,
    enabledFulfillmentMethods,
    meta: { cartItem = undefined } = {},
    changeFulfillment,
  } = useFulfillmentState();
  const {
    fulfillment = {},
    product: { fulfillmentMethods: cartItemFulfillmentMethods = [] } = {},
  } = cartItem || {};

  const { method: activeCartItemFulfillmentMethod = DIRECT_SHIP } = fulfillment || {};
  const [selection, setSelection] = useState(labelMapping[activeCartItemFulfillmentMethod]);

  const handleChange = useCallback((elementName) => {
    const method = Object.keys(labelMapping).find(key => labelMapping[key] === elementName);
    setSelection(method);
    changeFulfillment(method, cartItem);
  }, [cartItem, changeFulfillment, labelMapping]);

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
        {enabledFulfillmentMethods.includes(DIRECT_SHIP) && (
          <FulfillmentPathItem
            name={DIRECT_SHIP_LABEL}
            attributes={{ disabled: !cartItemFulfillmentMethods.includes(DIRECT_SHIP) }}
          >
            <Availability productId={product.id} fulfillmentSelection={DIRECT_SHIP} />
          </FulfillmentPathItem>
        )}
        {enabledFulfillmentMethods.includes(BOPIS) && (
          <FulfillmentPathItem
            name={IN_STORE_PICKUP_BOPIS_LABEL}
            attributes={{ disabled: !cartItemFulfillmentMethods.includes(BOPIS) }}
          />
        )}
        {enabledFulfillmentMethods.includes(ROPIS) && (
          <FulfillmentPathItem
            name={IN_STORE_PICKUP_ROPIS_LABEL}
            attributes={{ disabled: !cartItemFulfillmentMethods.includes(ROPIS) }}
          />
        )}

      </RadioGroup>
    </div>
  );
}
