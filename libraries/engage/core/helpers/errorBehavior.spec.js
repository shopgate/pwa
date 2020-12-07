import get from 'lodash/get';
import { i18n } from './i18n';
import errorBehavior from './errorBehavior';

const { getErrorMessage } = errorBehavior;

jest.unmock('./i18n');

const locales = {
  cart: {
    errors: {
      coupon: {
        2002: 'cart errors coupon 2002',
        generic: 'cart errors coupon generic',
        'shopgate.cart.updateCoupons': {
          2002: 'pipeline cart errors coupon 2002',
        },
      },
      'shopgate.cart.updateCoupons': {
        2002: 'pipeline cart errors 2002',
      },
      2002: 'cart errors 2002',
      2003: 'cart errors 2003',
      generic: 'cart errors generic',
    },
  },
  common: {
    errors: {
      withDate: 'Date {date, date, yyyyMMdd}',
      2002: 'common errors 2002',
      generic: 'common errors generic',
    },
  },
};

const pipeline = 'shopgate.cart.updateCoupons';

describe('errorBehavior', () => {
  beforeAll(() => {
    i18n.init({
      locales,
      lang: 'en-US',
    });
  });

  describe('.getErrorMessage()', () => {
    it('should return the correct message for cart.errors.coupon.2002', () => {
      expect(getErrorMessage('cart.errors.coupon.2002')).toBe(get(locales, 'cart.errors.coupon.2002'));
    });

    it('should return the correct message for cart.errors.coupon.2002', () => {
      expect(getErrorMessage('cart.errors.coupon.2002', undefined, pipeline)).toBe(get(locales, [
        'cart',
        'errors',
        'coupon',
        pipeline,
        '2002',
      ]));
    });

    it('should return the fallback for cart.errors.coupon.2004', () => {
      expect(getErrorMessage('cart.errors.coupon.2004')).toBe(get(locales, 'cart.errors.coupon.generic'));
    });

    it('should return the global cart error 2003 message for cart.errors.coupon.2003', () => {
      expect(getErrorMessage('cart.errors.coupon.2003')).toBe(get(locales, 'cart.errors.2003'));
    });

    it('should return the correct message for cart.errors.2002', () => {
      expect(getErrorMessage('cart.errors.2002')).toBe(get(locales, 'cart.errors.2002'));
    });

    it('should return the correct message for cart.errors.2002 when a pipeline was specified', () => {
      expect(getErrorMessage('cart.errors.2002', undefined, pipeline)).toBe(get(locales, [
        'cart',
        'errors',
        pipeline,
        '2002',
      ]));
    });

    it('should return the fallback cart.errors.2004', () => {
      expect(getErrorMessage('cart.errors.2004')).toBe(get(locales, 'cart.errors.generic'));
    });

    it('should return the correct message for foo.bar.2002', () => {
      expect(getErrorMessage('foo.bar.2002')).toBe(get(locales, 'common.errors.2002'));
    });

    it('should return the common fallback foo.bar', () => {
      expect(getErrorMessage('foo.bar')).toBe(get(locales, 'common.errors.generic'));
    });

    it('should return a string with a date', () => {
      expect(getErrorMessage('common.errors.withDate', {
        date: '2020-09-09T14:22:08.000Z',
      })).toBe('Date 9/9/2020');
    });

    it('should return the generic error when translation fails', () => {
      expect(getErrorMessage('common.errors.withDate')).toBe(get(locales, 'common.errors.generic'));
    });
  });
});
