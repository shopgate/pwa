// @flow
export type MerchantSettings = {
  enabledFulfillmentMethods: string[];
  enabledFulfillmentMethodSelectionForEngage: string[];
}

export type ShopSettings = {
  supportedCountries?: string[];
}

export type ConfigState = {
  isFetching: boolean;
  expires: number;
  merchantSettings: MerchantSettings;
  shopSettings: ShopSettings,
}
