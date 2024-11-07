// @flow
import { DIRECT_SHIP, ROPIS, BOPIS } from '../../constants';
import { type Location, type UserLocationFulfillmentMethod } from '../../locations.types';

export type Selection = typeof DIRECT_SHIP | typeof ROPIS | typeof BOPIS | null;

export type UserSearch = {
  geolocation: null,
  postalCode: null,
}

export type FulfillmentSelectorContextProps = {
  selection: Selection,
  selectedLocation: Location | null,
  location?: Location | null,
  isDirectShipEnabled: boolean,
  isROPISEnabled: boolean,
  isBOPISEnabled: boolean,
  isReady: boolean,
  productId: string,
  handleChange: (element: Selection, changeOnly: boolean) => void,
  conditioner: any,
  fulfillmentPaths: string[],
  merchantSettings: Object,
  userFulfillmentMethod: string | null,
  isOrderable: boolean,
  shopFulfillmentMethods?: string[] | null,
  productFulfillmentMethods: string[] | null,
  locationFulfillmentMethods: string[] | null,
  useLocationFulfillmentMethods: boolean,
  inventory?: Object,
  preferredLocation?: Object,
}

export type OwnProps = {
  conditioner: any,
  productId: string,
}

export type StateProps = {
  merchantSettings?: Object,
  shopFulfillmentMethods?: string[] | null,
  productFulfillmentMethods: string[] | null,
  locationFulfillmentMethods: string[] | null,
  useLocationFulfillmentMethods: boolean,
  isDirectShipEnabled: boolean,
  isROPISEnabled: boolean,
  isBOPISEnabled: boolean,
  preferredLocation: Location | null,
  inventory: any,
  userFulfillmentMethod: string | null,
  fulfillmentPaths: string[],
  isOrderable: boolean,
  isReady: boolean,
}

export type DispatchProps = {
  storeFulfillmentMethod: (method: UserLocationFulfillmentMethod) => void,
}
