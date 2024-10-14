import * as React from 'react';
import { FulfillmentContext } from './locations.context';

/**
 * Returns the fulfillment context state.
 * @returns {Object} The fulfillment context state.
 */
export function useFulfillmentState() {
  return React.useContext(FulfillmentContext);
}
