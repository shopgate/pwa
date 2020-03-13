// @flow
import { createContext } from 'react';
import { type FulfillmentSelectorContextProps } from './FulfillmentSelector.types';
import { DIRECT_SHIP } from '../../constants';

export const FulfillmentSelectorContext = createContext<FulfillmentSelectorContextProps>({
  selection: DIRECT_SHIP,
  selectedLocation: null,
  location: null,
  disabled: true,
  productId: null,
  handleChange: async () => { },
  conditioner: {},
  fulfillmentPaths: [],
  userFulfillmentMethod: null,
});
