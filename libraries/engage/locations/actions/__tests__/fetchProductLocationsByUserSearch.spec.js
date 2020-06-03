import { getGeolocation } from '@shopgate/engage/core';
import fetchProductLocations from '../fetchProductLocations';
import fetchProductLocationsByUserSearch from '../fetchProductLocationsByUserSearch';

jest.mock('@shopgate/engage/core', () => ({
  getGeolocation: jest.fn(),
}));

jest.mock('../../selectors', () => ({
  makeGetUserSearchCountryCode: () => () => 'DE',
}));
jest.mock('../../action-creators', () => ({
  setUserSearchSuccess: () => {},
}));
jest.mock('../fetchProductLocations', () => jest.fn());

describe('fetchProductLocationsByUserSearch', () => {
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

  it('should determine geo coordinates and fetch product locations afterwards', async () => {
    await expect(fetchProductLocationsByUserSearch(productId)(dispatch)).resolves.toBe(null);
    expect(getGeolocation).toHaveBeenCalledTimes(1);
    expect(getGeolocation).toHaveBeenCalledWith({
      useSettingsModal: true,
      requestPermissions: true,
    });
    expect(fetchProductLocations).toHaveBeenCalledTimes(1);
    expect(fetchProductLocations).toHaveBeenCalledWith(productId, coordinates);
  });

  it('should resolve undefined when determination of geo coordinates fails', async () => {
    getGeolocation.mockRejectedValueOnce(new Error());
    await expect(fetchProductLocationsByUserSearch(productId)(dispatch)).resolves.toBe(undefined);
    expect(getGeolocation).toHaveBeenCalledTimes(1);
    expect(getGeolocation).toHaveBeenCalledWith({
      useSettingsModal: true,
      requestPermissions: true,
    });
    expect(fetchProductLocations).not.toHaveBeenCalled();
  });

  it('should dispatch getGeolocation with useSettingsModal: false', async () => {
    getGeolocation.mockRejectedValueOnce(new Error());
    await expect(fetchProductLocationsByUserSearch(productId, null, true)(dispatch))
      .resolves.toBe(undefined);
    expect(getGeolocation).toHaveBeenCalledTimes(1);
    expect(getGeolocation).toHaveBeenCalledWith({
      useSettingsModal: false,
      requestPermissions: true,
    });
    expect(fetchProductLocations).not.toHaveBeenCalled();
  });

  it('should fetch product locations when called with a productId and search params', async () => {
    await expect(fetchProductLocationsByUserSearch(productId, search)(dispatch))
      .resolves.toBe(null);
    expect(getGeolocation).not.toHaveBeenCalled();
    expect(fetchProductLocations).toHaveBeenCalledTimes(1);
    expect(fetchProductLocations).toHaveBeenCalledWith(productId, { ...search });
  });

  it('should fetch product locations when called with a productId and an empty search', async () => {
    await expect(fetchProductLocationsByUserSearch(productId, {
      ...search,
      postalCode: '',
    })(dispatch)).resolves.toBe(null);
    expect(getGeolocation).not.toHaveBeenCalled();
    expect(fetchProductLocations).toHaveBeenCalledTimes(1);
    expect(fetchProductLocations).toHaveBeenCalledWith(productId, {});
  });

  it('should resolve with a translation placeholder when no stores where found for the zip code', async () => {
    const error = new Error();
    error.code = 'ENOTFOUND';
    fetchProductLocations.mockRejectedValueOnce(error);
    await expect(fetchProductLocationsByUserSearch(productId, {
      ...search,
      postalCode: '',
    })(dispatch)).rejects.toBe(error);
    expect(fetchProductLocations).toHaveBeenCalledTimes(1);
    expect(fetchProductLocations).toHaveBeenCalledWith(productId, {});
  });
});
