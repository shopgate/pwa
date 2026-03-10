import { getProductPriceData } from '@shopgate/pwa-common-commerce/product';
import {
  makeGetProductPriceData,
  makeGetProductMapPrice,
} from '../price';
import { wrapMemoizedSelector } from '../helpers';

jest.mock('@shopgate/pwa-common-commerce/product', () => ({
  getProductPriceData: jest.fn(),
}));

describe('engage > product > selectors > price', () => {
  describe('makeGetProductPriceData()', () => {
    let getProductPriceDataWrapped;
    beforeEach(() => {
      getProductPriceDataWrapped = wrapMemoizedSelector(makeGetProductPriceData());
    });

    it('should return null', () => {
      getProductPriceData.mockReturnValueOnce(null);
      expect(getProductPriceDataWrapped()).toEqual(null);
    });

    it('should return price data', () => {
      getProductPriceData.mockReturnValueOnce({
        unitAmount: 10,
      });
      expect(getProductPriceDataWrapped({}, {})).toEqual({
        unitAmount: 10,
      });
    });
  });

  describe('makeGetProductMapPrice()', () => {
    let getProductMapPricing;
    beforeEach(() => {
      getProductMapPricing = wrapMemoizedSelector(makeGetProductMapPrice());
    });

    it('should return null when price is null', () => {
      getProductPriceData.mockReturnValueOnce(null);
      expect(getProductMapPricing({}, { productId: '456' })).toBeNull();
    });
    it('should return null when mapPricing is null', () => {
      getProductPriceData.mockReturnValueOnce({
        unitAmount: 10,
      });
      expect(getProductMapPricing({}, { productId: '456' })).toBeNull();
    });
    it('should return from pojo', () => {
      getProductPriceData.mockReturnValueOnce({
        mapPricing: {
          price: 10,
        },
      });
      expect(getProductMapPricing({}, { productId: '456' })).toEqual({
        price: 10,
      });
    });
    it('should return from array', () => {
      getProductPriceData.mockReturnValueOnce({
        mapPricing: [{
          price: 10,
        }],
      });
      expect(getProductMapPricing({}, { productId: '456' })).toEqual({
        price: 10,
      });
    });
  });
});
