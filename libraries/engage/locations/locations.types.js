// @flow
import {
  DIRECT_SHIP,
  IN_STORE_PICKUP,
  STAGE_SELECT_STORE,
  STAGE_RESERVE_FORM,
  STAGE_RESPONSE_SUCCESS,
  STAGE_RESPONSE_ERROR,
  QUICK_RESERVE,
  MULTI_LINE_RESERVE,
} from './constants';

type LocationType = {
  code: string;
  name: string;
}

export type LocationOperationHours = {
  sun: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
}

type LocationProductInventory = {
  isAvailable: boolean;
  visible: number | null;
}

export type LocationAddress = {
  code: string;
  name: string;
  street: string;
  street2: string | null;
  street3: string | null;
  street4: string | null;
  postalCode: string;
  city: string;
  region: string;
  country: string;
  phoneNumber: string;
  faxNumber: string;
  emailAddress: string;
  isPrimary: boolean;
}

export type Location = {
  code: string | null;
  name: string | null;
  status?: string;
  supportedFulfillmentMethods?: string[];
  latitude?: number;
  longitude?: number;
  timeZone?: string;
  localeCode?: string;
  isComingSoon?: boolean;
  isDefault?: boolean;
  type?: LocationType;
  operationHours?: LocationOperationHours;
  address?: LocationAddress;
  addresses?: LocationAddress[];
  productInventory?: LocationProductInventory;
  distance?: number;
  unitSystem?: string;
}

export type LocationAware = {
  location: Location
}

export type OptionalLocationAware = {
  location?: Location | null
}

type ProductLocations = {
  isFetching: boolean;
  expires: number;
  locations: Location[];
}

export type LocationsByIdState = {
  [code: string]: Location;
}

export type LocationsByProductIdState = {
  [productId: string]: ProductLocations
}

export type FulfillmentPath = typeof QUICK_RESERVE
  | typeof MULTI_LINE_RESERVE;

export type UserLocationState = {
  code: string | null;
  name: string | null;
  productCode: string | null;
  visibleInventory: number | null;
  addressCode: string | null;
  fulfillmentMethod: typeof DIRECT_SHIP
  | typeof IN_STORE_PICKUP;
}

export type ReservationFormValues = {
  firstName?: string;
  lastName?: string;
  cellPhone?: string;
  email?: string;
  firstName2?: string;
  lastName2?: string;
  cellPhone2?: string;
  email2?: string;
}

export type UserLocationFulfillmentMethod = typeof DIRECT_SHIP
  | typeof IN_STORE_PICKUP;

export type UserLocationLocationCode = string | null;

export type UserFormInputState = {
  [string]: string | null;
}

export type LocationsState = {
  locationsById: LocationsByIdState | {};
  locationsByProductId: LocationsByProductIdState | {};
  userLocation: UserLocationState | {};
  userFormInput: ReservationFormValues;
  userSearchQuery: string;
}

export type SheetStage = typeof STAGE_SELECT_STORE
  | typeof STAGE_RESERVE_FORM | typeof STAGE_RESPONSE_SUCCESS | typeof STAGE_RESPONSE_ERROR;

export type SheetCallbackFn = (
  location: Location | null,
  productId: string | null,
  orderSuccess: boolean | null
) => void;

export type SheetOpenParams = {
  callback?: SheetCallbackFn;
  stage?: SheetStage;
  fulfillmentPath?: FulfillmentPath;
  changeOnly?: boolean;
}

export type ReservationResponse = {
  orderNumbers: string[] | null;
  errors: string[] | null;
}
