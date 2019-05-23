/* eslint-disable extra-rules/no-single-line-objects */
import { getQuantityRange } from './helpers';

jest.mock('../../../core', () => ({
  useWidgetSettings: jest.fn().mockReturnValue({
    minOrderQuantity: 3,
    maxOrderQuantity: 10,
  }),
}));

describe('QuantityPicker/helpers', () => {
  describe('should return correct min', () => {
    it('should return 3 from settings with empty stock', () => {
      expect(getQuantityRange()).toEqual({ min: 3, max: 10 });
    });
    it('should return 1 from stock', () => {
      expect(getQuantityRange({ minOrderQuantity: 1 }))
        .toEqual({ min: 1, max: 10 });
    });
    it('should return 5 from stock', () => {
      expect(getQuantityRange({ minOrderQuantity: 5 }))
        .toEqual({ min: 5, max: 10 });
    });
  });
  describe('should return correct max', () => {
    it('should return 10 from settings with empty stock', () => {
      expect(getQuantityRange()).toEqual({ min: 3, max: 10 });
    });
    it('should return 5 from stock', () => {
      expect(getQuantityRange({
        minOrderQuantity: 1,
        maxOrderQuantity: 5,
      })).toEqual({ min: 1, max: 5 });
    });
    it('should return 5 from stock', () => {
      expect(getQuantityRange({
        minOrderQuantity: 5,
        maxOrderQuantity: 8,
      })).toEqual({ min: 5, max: 8 });
    });
    it('should return 2 as max based on 2 as min from stock', () => {
      expect(getQuantityRange({
        maxOrderQuantity: 2,
      })).toEqual({ min: 2, max: 2 });
    });
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
