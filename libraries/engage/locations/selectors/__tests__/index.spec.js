/* eslint-disable extra-rules/no-single-line-objects */
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import { makeGetLocation, makeGetProductLocation } from '../index';

jest.mock('@shopgate/engage/product', () => ({
  getProduct: jest.fn(),
}));

describe('engage > locations > selectors', () => {
  const mockedState = {
    locations: {
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
      },
    },
  };

  describe('getLocation()', () => {
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
});
/* eslint-enable extra-rules/no-single-line-objects */
