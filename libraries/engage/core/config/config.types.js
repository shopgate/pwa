// @flow
export type MerchantSettings = {
  enabledFulfillmentMethods: string[];
  enabledFulfillmentMethodSelectionForEngage: string[];
}

export type ConfigState = {
  isFetching: boolean;
  expires: number;
  merchantSettings: MerchantSettings;
}
