import {
  getFlags,
  hasCouponSupport,
  getIsFetching,
} from './index';

describe('Cart selectors', () => {
  describe('getFlags()', () => {
    it('should return an empty object if no flags are available', () => {
      const result = getFlags({ cart: {} });
      expect(result).toEqual({});
    });

    it('should return the flags if available', () => {
      const flags = {
        coupons: true,
        orderable: true,
      };

      const result = getFlags({ cart: { flags } });
      expect(result).toEqual(flags);
    });
  });

  describe('hasCouponSupport()', () => {
    it('should return true if no flags are available', () => {
      const result = hasCouponSupport({ cart: {} });
      expect(result).toEqual(true);
    });

    it('should return true if the coupons flag is not available', () => {
      const result = hasCouponSupport({ cart: { flags: {} } });
      expect(result).toEqual(true);
    });

    it('should return true if the flag is true', () => {
      const result = hasCouponSupport({ cart: { flags: { coupons: true } } });
      expect(result).toEqual(true);
    });

    it('should return false if the flag is false', () => {
      const result = hasCouponSupport({ cart: { flags: { coupons: false } } });
      expect(result).toEqual(false);
    });
  });

  describe('isFetching()', () => {
    it('should return true if cart is fetching', () => {
      const result = getIsFetching({ cart: { isFetching: true } });
      expect(result).toEqual(true);
    });

    it('should return false when no store information is given', () => {
      const result = getIsFetching({ cart: {} });
      expect(result).toEqual(false);
    });

    it('should return false if cart is not fetching', () => {
      const result = getIsFetching({ cart: { isFetching: false } });
      expect(result).toEqual(false);
    });
  });
});
