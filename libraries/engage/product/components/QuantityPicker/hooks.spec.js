/* eslint-disable extra-rules/no-single-line-objects */
import { useQuantityRange } from './hooks';

jest.mock('../../../core', () => ({
  useWidgetSettings: jest.fn().mockReturnValue({
    minOrderQuantity: 3,
    maxOrderQuantity: 10,
  }),
}));

describe('QuantityPicker/hooks', () => {
  describe('should return correct min', () => {
    it('should return 3 from settings with empty stock', () => {
      expect(useQuantityRange()).toEqual({ min: 3, max: 10 });
    });
    it('should return 1 from stock', () => {
      expect(useQuantityRange({ minOrderQuantity: 1 }))
        .toEqual({ min: 1, max: 10 });
    });
    it('should return 5 from stock', () => {
      expect(useQuantityRange({ minOrderQuantity: 5 }))
        .toEqual({ min: 5, max: 10 });
    });
  });
  describe('should return correct max', () => {
    it('should return 10 from settings with empty stock', () => {
      expect(useQuantityRange()).toEqual({ min: 3, max: 10 });
    });
    it('should return 5 from stock', () => {
      expect(useQuantityRange({
        minOrderQuantity: 1,
        maxOrderQuantity: 5,
      })).toEqual({ min: 1, max: 5 });
    });
    it('should return 5 from stock', () => {
      expect(useQuantityRange({
        minOrderQuantity: 5,
        maxOrderQuantity: 8,
      })).toEqual({ min: 5, max: 8 });
    });
    it('should return 2 as max based on 2 as min from stock', () => {
      expect(useQuantityRange({
        maxOrderQuantity: 2,
      })).toEqual({ min: 2, max: 2 });
    });
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
