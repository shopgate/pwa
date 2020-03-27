import { getGeolocation } from '@shopgate/engage/core';
import { fetchProductLocations } from '../../../actions';
import { getProductLocations } from '../StoreListSearch.actions';

jest.mock('@shopgate/engage/core', () => ({
  getGeolocation: jest.fn(),
}));
jest.mock('../../../actions', () => ({
  fetchProductLocations: jest.fn(),
}));

describe('StoreListSearch actions', () => {
  const dispatch = jest.fn(input => Promise.resolve(input));

  const productId = 'ABC123';
  const search = {
    countryCode: 'DE',
    postalCode: 'ACME',
  };
  const coordinates = {
    longitude: '123456',
    latitude: '654321',
  };

  beforeAll(() => {
    getGeolocation.mockResolvedValue(coordinates);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProductLocations', () => {
    it('should determine geo coordinates and fetch product locations afterwards', async () => {
      await expect(getProductLocations(productId)(dispatch)).resolves.toBe(undefined);
      expect(getGeolocation).toHaveBeenCalledTimes(1);
      expect(getGeolocation).toHaveBeenCalledWith({ useSettingsModal: true });
      expect(fetchProductLocations).toHaveBeenCalledTimes(1);
      expect(fetchProductLocations).toHaveBeenCalledWith(productId, coordinates);
    });

    it('should resolve undefined when determination of geo coordinates fails', async () => {
      getGeolocation.mockRejectedValueOnce(new Error());
      await expect(getProductLocations(productId)(dispatch)).resolves.toBe(undefined);
      expect(getGeolocation).toHaveBeenCalledTimes(1);
      expect(getGeolocation).toHaveBeenCalledWith({ useSettingsModal: true });
      expect(fetchProductLocations).not.toHaveBeenCalled();
    });

    it('should dispatch getGeolocation with useSettingsModal: false', async () => {
      getGeolocation.mockRejectedValueOnce(new Error());
      await expect(getProductLocations(productId, null, true)(dispatch)).resolves.toBe(undefined);
      expect(getGeolocation).toHaveBeenCalledTimes(1);
      expect(getGeolocation).toHaveBeenCalledWith({ useSettingsModal: false });
      expect(fetchProductLocations).not.toHaveBeenCalled();
    });

    it('should fetch product locations when called with a productId and search params', async () => {
      await expect(getProductLocations(productId, search)(dispatch)).resolves.toBe(undefined);
      expect(getGeolocation).not.toHaveBeenCalled();
      expect(fetchProductLocations).toHaveBeenCalledTimes(1);
      expect(fetchProductLocations).toHaveBeenCalledWith(productId, { ...search });
    });

    it('should fetch product locations when called with a productId and an empty search', async () => {
      await expect(getProductLocations(productId, {
        ...search,
        postalCode: '',
      })(dispatch)).resolves.toBe(undefined);
      expect(getGeolocation).not.toHaveBeenCalled();
      expect(fetchProductLocations).toHaveBeenCalledTimes(1);
      expect(fetchProductLocations).toHaveBeenCalledWith(productId, {});
    });

    it('should resolve with a translation placeholder when no stores where found for the zip code', async () => {
      const error = new Error();
      error.code = 'ENOTFOUND';
      fetchProductLocations.mockRejectedValueOnce(error);
      await expect(getProductLocations(productId, {
        ...search,
        postalCode: '',
      })(dispatch)).resolves.toBe('locations.error_invalid_zip_code');
      expect(fetchProductLocations).toHaveBeenCalledTimes(1);
      expect(fetchProductLocations).toHaveBeenCalledWith(productId, {});
    });
  });
});
