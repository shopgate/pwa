import {
  getProductPropertiesState,
  getProductId,
  getProduct,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import { makeGetProductProperties, makeGetProductEffectivityDates } from '../product';

jest.mock('@shopgate/pwa-common-commerce/product/selectors/product', () => ({
  getProduct: jest.fn(),
  getProductPropertiesState: jest.fn(),
  getProductId: jest.fn(),
}));

const mockState = {
  123: {
    properties: [{
      label: 'Test',
      value: '123',
    }],
    startDate: '2019-04-01T10:00:00.000Z',
    endDate: '2019-04-10T10:00:00.000Z',
  },
  456: { properties: null },
};

/**
 * Memoization test
 * @param {Function} selector selector
 * @returns {Function}
 */
const wrapMemoizedSelector = selector => (...args) => {
  const result = selector(...args);
  if (selector(...args) !== result) {
    throw new Error('Memoization check failed.');
  }
  return result;
};

describe('engage > product > selectors', () => {
  describe('getProductProperties()', () => {
    let getProductProperties;
    beforeEach(() => {
      getProductProperties = wrapMemoizedSelector(makeGetProductProperties());
    });

    it('should return null if a properties state can not be found', () => {
      getProductPropertiesState.mockReturnValueOnce(mockState);
      getProductId.mockReturnValueOnce('012');
      const result = getProductProperties(mockState, { productId: '012' });
      expect(result).toEqual(null);
    });

    it('should return null of no properties have been received for the product', () => {
      getProductPropertiesState.mockReturnValueOnce(mockState);
      getProductId.mockReturnValueOnce('456');
      const result = getProductProperties(mockState, { productId: '456' });
      expect(result).toEqual(null);
    });

    it('should renturn properties if they are set for the product', () => {
      getProductPropertiesState.mockReturnValueOnce(mockState);
      getProductId.mockReturnValueOnce('123');
      const result = getProductProperties(mockState, { productId: '123' });
      expect(result).toEqual([{
        label: 'Test',
        value: '123',
      }]);
    });
  });

  describe('getProductEffectivityDates()', () => {
    let getProductEffectivityDates;
    beforeEach(() => {
      getProductEffectivityDates = wrapMemoizedSelector(makeGetProductEffectivityDates());
    });

    it('should return null', () => {
      getProduct.mockReturnValueOnce(null);
      expect(getProductEffectivityDates(mockState, { productId: '456' })).toBeNull();
    });
    it('should return dates', () => {
      getProduct.mockReturnValueOnce(mockState[123]);
      expect(getProductEffectivityDates(mockState, { productId: '123' })).toEqual({
        startDate: '2019-04-01T10:00:00.000Z',
        endDate: '2019-04-10T10:00:00.000Z',
      });
    });
  });
});
