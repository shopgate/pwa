import { makeGetLocation } from '../index';

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
});
