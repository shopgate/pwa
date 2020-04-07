/* eslint-disable extra-rules/no-single-line-objects */
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import { getUserData, getExternalCustomerNumber, getUserId } from '@shopgate/engage/user';
import { makeGetEnabledFulfillmentMethods } from '@shopgate/engage/core';
import {
  DIRECT_SHIP,
  IN_STORE_PICKUP,
} from '../../constants';
import {
  makeGetUserLocation,
  makeGetUserLocationFulfillmentMethod,
  makeGetUserLocationCode,
  makeGetLocation,
  makeGetProductLocation,
  makeIsRopeProductOrderable,
  makeGetUserFormInput,
  makeGetUserSearchPostalCode,
  makeGetUserSearchCountryCode,
  getExternalCustomerNumberForOrder,
} from '../index';
import { isProductAvailable } from '../../helpers/productInventory';

jest.mock('@shopgate/engage/product', () => ({
  getProduct: jest.fn(),
}));
jest.mock('@shopgate/engage/user', () => ({
  getUserData: jest.fn(),
  getUserId: jest.fn(),
  getExternalCustomerNumber: jest.fn(),
}));
jest.mock('@shopgate/engage/core', () => ({
  makeGetEnabledFulfillmentMethods: jest.fn(),
}));

jest.mock('../../helpers/productInventory', () => ({
  isProductAvailable: jest.fn().mockReturnValue(true),
}));

describe('engage > locations > selectors', () => {
  makeGetEnabledFulfillmentMethods.mockReturnValue(() => DIRECT_SHIP);
  const mockedState = {
    locations: {
      userLocation: {
        code: 'code 1',
        name: 'ACME Store',
        fulfillmentMethod: IN_STORE_PICKUP,
      },
      locationsById: {
        code1: {
          code: 'code1',
          name: 'Code 1',
        },
      },
      locationsByProductId: {
        sg1: {
          locations: [{ code: 'SG1' }],
          isFetching: false,
          expires: 5,
        },
        sg2: {
          locations: [{ code: 'code 1' }],
          isFetching: false,
          expires: 5,
        },
      },
      userSearch: {
        postalCode: '35510',
        countryCode: 'DE',
      },
    },
  };

  describe('makeGetUserLocation()', () => {
    let getUserLocation;

    beforeEach(() => {
      getUserLocation = makeGetUserLocation();
    });

    it('should return null when the locations state is empty', () => {
      expect(getUserLocation({ locations: {} })).toBeNull();
    });

    it('should return null when the userLocation state is empty', () => {
      expect(getUserLocation({ locations: { userLocation: null } })).toBeNull();
    });

    it('should return the userLocation state', () => {
      expect(getUserLocation(mockedState)).toEqual(mockedState.locations.userLocation);
    });
  });

  describe('makeGetUserLocationFulfillmentMethod()', () => {
    let getUserLocationFulfillmentMethod;

    beforeEach(() => {
      getUserLocationFulfillmentMethod = makeGetUserLocationFulfillmentMethod();
    });

    it('should return "direct ship" when the state is empty', () => {
      expect(getUserLocationFulfillmentMethod({})).toEqual(DIRECT_SHIP);
    });

    it('should return "pickup in store" when it is set within the state', () => {
      expect(getUserLocationFulfillmentMethod(mockedState))
        .toEqual(IN_STORE_PICKUP);
    });
  });

  describe('makeGetUserLocationCode()', () => {
    let getUserLocationCodeMethod;

    beforeEach(() => {
      getUserLocationCodeMethod = makeGetUserLocationCode();
    });

    it('should return null when the state is empty', () => {
      expect(getUserLocationCodeMethod({})).toBeNull();
    });

    it('should return the user location code', () => {
      expect(getUserLocationCodeMethod(mockedState))
        .toEqual(mockedState.locations.userLocation.code);
    });
  });

  describe('makeGetLocation()', () => {
    let getLocation;

    beforeEach(() => {
      getLocation = makeGetLocation();
    });

    it('should return null', () => {
      expect(getLocation(mockedState, { locationId: 'code2' })).toBeNull();
    });

    it('should return location', () => {
      expect(getLocation(mockedState, { locationId: 'code1' })).toEqual({
        ...mockedState.locations.locationsById.code1,
      });
    });
  });

  describe('makeGetProductLocation()', () => {
    let getProductLocation;

    describe('location code from props', () => {
      beforeEach(() => {
        getProductLocation = makeGetProductLocation();
      });

      it('should return null', () => {
        expect(getProductLocation(mockedState, { locationId: 'SG1', productId: 'sg2' })).toBeNull();
      });

      it('should return location', () => {
        expect(getProductLocation(mockedState, { locationId: 'SG1', productId: 'sg1' })).toEqual({
          ...mockedState.locations.locationsByProductId.sg1.locations[0],
        });
      });

      it('should return null when fetching and location data is not available yet', () => {
        const localState = cloneDeep(mockedState);
        set(localState, 'locations.locationsByProductId.sg1.locations', undefined);
        expect(getProductLocation(localState, { locationId: 'SG1', productId: 'sg1' })).toBeNull();
      });

      it('should return locations when locations are currently fetching', () => {
        const localState = cloneDeep(mockedState);
        set(localState, 'locations.locationsByProductId.sg1.isFetching', true);
        expect(getProductLocation(localState, { locationId: 'SG1', productId: 'sg1' })).toEqual({
          ...mockedState.locations.locationsByProductId.sg1.locations[0],
        });
      });
    });

    describe('location code from user location', () => {
      beforeEach(() => {
        getProductLocation = makeGetProductLocation(true);
      });

      it('should return the product location for the userLocation code', () => {
        expect(getProductLocation(mockedState, { locationId: 'SG1', productId: 'sg2' })).toEqual(
          mockedState.locations.locationsByProductId.sg2.locations[0]
        );
      });

      it('should return null when the code within the userLocation state is empty', () => {
        const localState = cloneDeep(mockedState);
        set(localState, 'locations.userLocation.code', null);
        expect(getProductLocation(localState, { locationId: 'SG1', productId: 'sg1' })).toBeNull();
      });
    });
  });

  describe('makeIsRopeProductOrderable()', () => {
    let isRopeProductOrderable;

    describe('location code from props', () => {
      beforeEach(() => {
        isRopeProductOrderable = makeIsRopeProductOrderable();
      });

      it('should return true when "direct ship" is selected as user fulfillment method', () => {
        const localState = cloneDeep(mockedState);
        set(localState, 'locations.userLocation.fulfillmentMethod', DIRECT_SHIP);
        expect(isRopeProductOrderable(localState, { locationId: 'SG1', productId: 'sg1' })).toBe(null);
      });

      it('should return false when no matching location was found at the product', () => {
        const localState = cloneDeep(mockedState);
        set(localState, 'locations.locationsByProductId.sg1.locations', []);
        expect(isRopeProductOrderable(localState, { locationId: 'SG1', productId: 'sg1' })).toBe(false);
      });

      it('should return false when the product is not available at the location', () => {
        isProductAvailable.mockReturnValueOnce(false);
        expect(isRopeProductOrderable(mockedState, { locationId: 'SG1', productId: 'sg1' })).toBe(false);
      });

      it('should return true when the product is available at the location', () => {
        expect(isRopeProductOrderable(mockedState, { locationId: 'SG1', productId: 'sg1' })).toBe(true);
      });
    });

    describe('location code from user location', () => {
      beforeEach(() => {
        isRopeProductOrderable = makeIsRopeProductOrderable(true);
      });

      it('should return true when "direct ship" is selected as user fulfillment method', () => {
        const localState = cloneDeep(mockedState);
        set(localState, 'locations.userLocation.fulfillmentMethod', DIRECT_SHIP);
        expect(isRopeProductOrderable(localState, { locationId: 'SG2', productId: 'sg2' })).toBe(null);
      });

      it('should return false when no matching location was found at the product', () => {
        const localState = cloneDeep(mockedState);
        set(localState, 'locations.locationsByProductId.sg2.locations', []);
        expect(isRopeProductOrderable(localState, { locationId: 'SG2', productId: 'sg2' })).toBe(false);
      });

      it('should return false when the product is not available at the location', () => {
        isProductAvailable.mockReturnValueOnce(false);
        expect(isRopeProductOrderable(mockedState, { locationId: 'SG2', productId: 'sg2' })).toBe(false);
      });

      it('should return true when the product is available at the location', () => {
        expect(isRopeProductOrderable(mockedState, { locationId: 'SG2', productId: 'sg2' })).toBe(true);
      });
    });
  });

  describe('makeGetUserFormInput()', () => {
    const user = { firstName: 'firstName', lastName: 'lastName', email: 'E-mail' };

    let getUserFormInput;
    beforeEach(() => {
      getUserFormInput = makeGetUserFormInput();
    });

    it('should return null when the locations state is empty', () => {
      getUserData.mockReturnValueOnce(null);
      expect(getUserFormInput({ locations: {} })).toBeNull();
    });

    it('should return null when the userFormInput state is empty', () => {
      getUserData.mockReturnValueOnce(null);
      expect(getUserFormInput({ locations: { userFormInput: null } })).toBeNull();
    });

    it('should return user data when userFormInput state is empty', () => {
      getUserData.mockReturnValueOnce({
        firstName: 'firstName',
        lastName: 'lastName',
        mail: 'E-mail',
      });
      expect(getUserFormInput({ locations: { userFormInput: null } })).toEqual({ ...user });
    });

    it('should return userFormInput state', () => {
      getUserData.mockReturnValueOnce(null);
      expect(getUserFormInput({ locations: { userFormInput: { ...user } } })).toEqual({ ...user });
    });

    it('should return userFormInput when userData is defined', () => {
      getUserData.mockReturnValueOnce({
        firstName: 'first Name',
        lastName: 'last Name',
        mail: 'E - mail',
      });
      expect(getUserFormInput({ locations: { userFormInput: { ...user } } })).toEqual({ ...user });
    });
  });

  describe('makeGetUserSearchPostalCode', () => {
    let getUserPostalCode;
    beforeEach(() => {
      getUserPostalCode = makeGetUserSearchPostalCode();
    });

    it('should return the expected postal code', () => {
      expect(getUserPostalCode(mockedState)).toBe(mockedState.locations.userSearch.postalCode);
    });

    it('should return null when the postal code is null', () => {
      const localState = cloneDeep(mockedState);
      set(localState, 'locations.userSearch.postalCode', null);
      expect(getUserPostalCode(localState)).toBeNull();
    });
  });

  describe('makeGetUserSearchCountryCode', () => {
    let getUserCountryCode;
    beforeEach(() => {
      getUserCountryCode = makeGetUserSearchCountryCode();
    });

    it('should return the expected country code', () => {
      expect(getUserCountryCode(mockedState)).toBe(mockedState.locations.userSearch.countryCode);
    });

    it('should return "" when the country code is null', () => {
      const localState = cloneDeep(mockedState);
      set(localState, 'locations.userSearch.countryCode', null);
      expect(getUserCountryCode(localState)).toBe('');
    });
  });

  describe('getExternalCustomerNumberForOrder', () => {
    it('should return the external customer number', () => {
      const expected = '1234';
      getExternalCustomerNumber.mockReturnValueOnce(1234);
      const actual = getExternalCustomerNumberForOrder({});
      expect(actual).toBe(expected);
    });
    it('should return the id if no external customer number available', () => {
      const expected = '5678';
      getUserId.mockReturnValueOnce(5678);
      const actual = getExternalCustomerNumberForOrder({});
      expect(actual).toBe(expected);
    });
    it('should return undefined if not logged in', () => {
      const actual = getExternalCustomerNumberForOrder({});
      expect(actual).toBeUndefined();
    });
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
