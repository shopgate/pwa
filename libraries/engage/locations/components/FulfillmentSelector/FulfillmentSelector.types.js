// @flow
import { type ProductId } from '../../../product';
import { DIRECT_SHIP, IN_STORE_PICKUP } from '../../constants';
import { type Location, type UserLocationFulfillmentMethod } from '../../locations.types';

export type Selection = typeof DIRECT_SHIP | typeof IN_STORE_PICKUP;

export type FulfillmentSelectorContextProps = {
  selection: Selection,
  selectedLocation: Location | null,
  location: Location | null,
  disabled: boolean,
  productId: ProductId,
  handleChange: (element: Selection, changeOnly: boolean) => void,
  conditioner: any,
  fulfillmentPaths: string[],
  userFulfillmentMethod: string | null,
  isOrderable: boolean,
  shopFulfillmentMethods?: string[] | null,
  productFulfillmentMethods: string[] | null,
}

export type OwnProps = {
  conditioner: any,
  productId: string,
}

export type StateProps = {
  shopFulfillmentMethods?: string[] | null,
  productFulfillmentMethods: string[] | null,
  disabled: boolean,
  location: Location | null,
  userFulfillmentMethod: string | null,
  fulfillmentPaths: string[],
  isOrderable: boolean,
}

export type DispatchProps = {
  storeFulfillmentMethod: (method: UserLocationFulfillmentMethod) => void,
}
