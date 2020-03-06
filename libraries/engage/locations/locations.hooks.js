// @flow
import * as React from 'react';
import { FulfillmentContext, type FulfillmentContextProps } from './locations.context';

/**
 * Returns the fulfillment context state.
 * @returns {Object} The fulfillment context state.
 */
export function useFulfillmentState(): FulfillmentContextProps {
  return React.useContext(FulfillmentContext);
}
