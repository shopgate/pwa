import {
  getProductPropertiesState,
  getProductId,
  getProduct,
  getProductDataById,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import {
  makeGetProductProperties,
  makeGetProductEffectivityDates,
  makeGetProductCharacteristics,
} from '../product';
import { wrapMemoizedSelector } from '../helpers';

jest.mock('@shopgate/pwa-common-commerce/product/selectors/product', () => ({
  getProduct: jest.fn(),
  getProductPropertiesState: jest.fn(),
  getProductId: jest.fn(),
  getProductDataById: jest.fn(),
}));

const mockState = {
  123: {
    properties: [{
      label: 'Test',
      value: '123',
    }],
    startDate: '2019-04-01T10:00:00.000Z',
    endDate: '2019-04-10T10:00:00.000Z',
    characteristics: [{
      id: '01-color',
      label: 'Color',
      // more properties available but of no interest for tests
    }],
  },
  456: {
    properties: null,
    characteristics: null,
  },
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

  describe('getProductCharacteristics()', () => {
    let getProductCharacteristics;
    beforeEach(() => {
      getProductCharacteristics = wrapMemoizedSelector(makeGetProductCharacteristics());
    });

    it('should return null if a product state can not be found', () => {
      getProductDataById.mockReturnValueOnce(null);
      const result = getProductCharacteristics(mockState, { productId: '012' });
      expect(result).toEqual(null);
    });

    it('should return null of no characteristics are available for the product', () => {
      getProductDataById.mockReturnValueOnce(mockState[456]);
      const result = getProductCharacteristics(mockState, { productId: '456' });
      expect(result).toEqual(null);
    });

    it('should return all characteristics if available for the product', () => {
      getProductDataById.mockReturnValueOnce(mockState[123]);
      const result = getProductCharacteristics(mockState, { productId: '123' });
      expect(result).toEqual([{
        id: '01-color',
        label: 'Color',
      }]);
    });
  });
});
