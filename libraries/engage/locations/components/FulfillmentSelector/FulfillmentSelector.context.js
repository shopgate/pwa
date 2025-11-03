// eslint-disable-next-line max-len
/** @typedef {import('./FulfillmentSelector.types').FulfillmentSelectorContextProps} FulfillmentSelectorContextProps */

import { createContext } from 'react';
import { DIRECT_SHIP } from '../../constants';

/** @type {FulfillmentSelectorContextProps} */
export const FulfillmentSelectorContext = createContext({
  selection: DIRECT_SHIP,
  selectedLocation: null,
  location: null,
  isDirectShipEnabled: false,
  isROPISEnabled: false,
  isBOPISEnabled: false,
  isReady: false,
  productId: null,
  handleChange: () => {},
  conditioner: {},
  fulfillmentPaths: [],
  userFulfillmentMethod: null,
  isOrderable: false,
  shopFulfillmentMethods: null,
  productFulfillmentMethods: null,
  locationFulfillmentMethods: null,
  useLocationFulfillmentMethods: false,
  merchantSettings: null,
});
