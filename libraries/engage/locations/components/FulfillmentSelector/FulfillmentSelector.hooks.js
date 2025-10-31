// eslint-disable-next-line max-len
/** @typedef {import('./FulfillmentSelector.types').FulfillmentSelectorContextProps} FulfillmentSelectorContextProps */

import { useContext } from 'react';
import { FulfillmentSelectorContext } from './FulfillmentSelector.context';

/**
 * @returns {FulfillmentSelectorContextProps} The fulfillment selector context.
 */
export function useFulfillmentSelectorState() {
  return useContext(FulfillmentSelectorContext);
}
