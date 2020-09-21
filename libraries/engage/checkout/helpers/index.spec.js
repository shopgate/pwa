import { i18n } from '@shopgate/engage/core';
import {
  getPromotionLinesFromOrder,
  getCouponLinesFromOrder,
  getCheckoutTaxLinesFromOrder,
} from './index';

jest.mock('@shopgate/engage/core', () => ({
  i18n: {
    text: jest.fn(key => key),
  },
}));

jest.mock('@shopgate/engage/locations', () => ({
  DIRECT_SHIP: 'DIRECT_SHIP',
  ROPIS: 'ROPIS',
}));

const mockOrder = {
  currencyCode: 'USD',
  subTotal: 20.5,
  tax: 0.5,
  total: 21,
  appliedPromotions: [{
    code: 'coupon-promotion-code',
    name: 'Coupon Promotion Name',
    discount: {
      type: 'absolute',
      amount: -10,
      absoluteAmount: -10,
    },
    coupon: {
      code: 'coupon-code',
      name: 'Coupon Name',
    },
  }, {
    code: 'promotion-code',
    name: 'Promotion Name',
    discount: {
      type: 'absolute',
      amount: -5,
      absoluteAmount: -5,
    },
  }],
  coupons: [{
    code: 'coupon-code',
    name: 'Coupon Name',
    status: 'active',
    promotion: {
      code: 'coupon-promotion-code',
      name: 'Coupon Promotion Name',
    },
  }],
};

describe('Checkout helpers', () => {
  describe('.getPromotionLinesFromOrder()', () => {
    it('should generate an empty array when no order was passed', () => {
      expect(getPromotionLinesFromOrder()).toEqual([]);
    });

    it('should generate an empty array when there are no promotions within the order', () => {
      expect(getPromotionLinesFromOrder({})).toEqual([]);
    });

    it('should generate the expected lines', () => {
      expect(getPromotionLinesFromOrder(mockOrder)).toEqual([{
        visible: true,
        type: 'promotion',
        label: 'Promotion Name',
        value: -5,
        currencyCode: 'USD',
      }]);
    });
  });

  describe('.getCouponLinesFromOrder()', () => {
    it('should generate an empty array when no order was passed', () => {
      expect(getCouponLinesFromOrder()).toEqual([]);
      expect(i18n.text).not.toHaveBeenCalled();
    });

    it('should generate an empty array when there are no coupons within the order', () => {
      expect(getCouponLinesFromOrder({})).toEqual([]);
      expect(i18n.text).not.toHaveBeenCalled();
    });

    it('should generate the expected lines', () => {
      expect(getCouponLinesFromOrder(mockOrder)).toEqual([{
        visible: true,
        type: 'coupon',
        label: 'cart.coupon_label',
        value: -10,
        currencyCode: 'USD',
      }]);

      expect(i18n.text).toHaveBeenCalledWith('cart.coupon_label', { label: 'coupon-code' });
    });
  });

  describe('.getCheckoutTaxLinesFromOrder()', () => {
    it('should generate the expected data when no order was passed', () => {
      expect(getCheckoutTaxLinesFromOrder()).toEqual([
        {
          visible: true,
          type: 'subTotal',
          label: null,
          value: 0,
          currencyCode: undefined,
        },
        {
          visible: false,
          type: 'tax',
          label: null,
          value: 0,
          currencyCode: undefined,
        },
        {
          visible: true,
          type: 'total',
          label: null,
          value: 0,
          currencyCode: undefined,
        },
      ]);
    });

    it('should generate the expected data when is no data within the order', () => {
      expect(getCheckoutTaxLinesFromOrder({})).toEqual([
        {
          visible: true,
          type: 'subTotal',
          label: null,
          value: 0,
          currencyCode: undefined,
        },
        {
          visible: false,
          type: 'tax',
          label: null,
          value: 0,
          currencyCode: undefined,
        },
        {
          visible: true,
          type: 'total',
          label: null,
          value: 0,
          currencyCode: undefined,
        },
      ]);
    });

    it('should generate the expected lines', () => {
      expect(getCheckoutTaxLinesFromOrder(mockOrder)).toEqual([
        {
          visible: true,
          type: 'subTotal',
          label: null,
          value: 20.5,
          currencyCode: 'USD',
        },
        {
          visible: false,
          type: 'tax',
          label: null,
          value: 0,
          currencyCode: 'USD',
        },
        {
          visible: true,
          type: 'coupon',
          label: 'cart.coupon_label',
          value: -10,
          currencyCode: 'USD',
        },
        {
          visible: true,
          type: 'promotion',
          label: 'Promotion Name',
          value: -5,
          currencyCode: 'USD',
        },
        {
          visible: true,
          type: 'total',
          label: null,
          value: 21,
          currencyCode: 'USD',
        },
      ]);
    });
  });
});
