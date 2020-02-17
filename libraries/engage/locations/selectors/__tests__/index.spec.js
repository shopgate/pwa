/* eslint-disable extra-rules/no-single-line-objects */
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
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
