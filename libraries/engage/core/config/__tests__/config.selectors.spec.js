import { makeGetMerchantSettings } from '../config.selectors';

describe('engage > core > config > selectors', () => {
  const mockedState = {
    config: {
      merchantSettings: {
        foo: 'bar',
      },
    },
  };

  describe('makeGetMerchantSettingsState()', () => {
    let getMerchantSettings;

    beforeEach(() => {
      getMerchantSettings = makeGetMerchantSettings();
    });

    it('should return empty array', () => {
      expect(getMerchantSettings({})).toEqual({});
    });

    it('should return two products', () => {
      expect(getMerchantSettings(mockedState)).toEqual({
        ...mockedState.config.merchantSettings,
      });
    });
  });
});
