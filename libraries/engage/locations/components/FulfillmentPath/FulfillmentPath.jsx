// @flow
import * as React from 'react';
import { useFulfillmentState } from '../../locations.hooks';
// import {
//   PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP,
// } from '../../constants';

// const directShip = 'product.fulfillment_selector.direct_ship';
// const pickUp = 'product.fulfillment_selector.pick_up_in_store';

/**
 * Renders the fulfillment path selector stage.
 * @returns {JSX}
 */
export function FulfillmentPath() {
  const {
    product,
    meta,
  } = useFulfillmentState();

  console.warn('product', product);
  console.warn('meta', meta);

  return (
    <div>
      Fulfillment path
    </div>
  );
}
