/* eslint-disable require-jsdoc */
export const makeGetMerchantSettings = () => jest.fn().mockReturnValue({
  defaultLocale: 'de-de',
  defaultCurrency: 'EUR',
  defaultTimezone: 'Europe/Berlin',
  defaultUnitSystem: 'metric',
  enabledFulfillmentMethods: [
    'ROPIS',
    'BOPIS',
  ],
  enabledFulfillmentMethodSelectionForEngage: [
    'multiLineReserve',
  ],
});

/* eslint-enable require-jsdoc */
