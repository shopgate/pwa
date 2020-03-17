// @flow
import { useContext } from 'react';
import { type FulfillmentSelectorContextProps } from './FulfillmentSelector.types';
import { FulfillmentSelectorContext } from './FulfillmentSelector.context';

/**
 * @returns {Object} The fulfillment selector context.
 */
export function useFulfillmentSelectorState(): FulfillmentSelectorContextProps {
  return useContext(FulfillmentSelectorContext);
}
