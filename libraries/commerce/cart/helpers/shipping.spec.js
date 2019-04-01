/* eslint-disable extra-rules/no-single-line-objects */
import { getShippingLine } from './shipping';

describe('Cart helper shipping', () => {
  const cartConfig = {
    hideShipping: false,
    shipping: {
      hideFreeShipping: false,
      hideAnonymous: null,
      textForAnonymousUsers: null,
      textForFreeShipping: null,
      textForNoShipping: null,
      hint: '(incl)',
    },
  };

  describe('Should return null', () => {
    it('should return null on empty shipping cost', () => {
      expect(getShippingLine(cartConfig)).toBeNull();
    });
    it('should return null on hideShipping', () => {
      expect(getShippingLine({ hideShipping: true }, false, {})).toBeNull();
    });
    it('should return null on hideAnonymous', () => {
      expect(getShippingLine({
        ...cartConfig,
        shipping: {
          ...cartConfig.shipping,
          hideAnonymous: true,
        },
      }, false, {})).toBeNull();
    });
    it('should return null for no shipping', () => {
      expect(getShippingLine(cartConfig, false, { amount: null })).toBeNull();
    });
    it('should return null for hideFreeShipping', () => {
      expect(getShippingLine({
        ...cartConfig,
        shipping: {
          ...cartConfig.shipping,
          hideFreeShipping: true,
        },
      }, false, { amount: 0 })).toBeNull();
    });
  });

  describe('Should return shipping', () => {
    it('should return textForAnonymousUsers', () => {
      expect(getShippingLine({
        ...cartConfig,
        shipping: {
          ...cartConfig.shipping,
          textForAnonymousUsers: 'textForAnonymousUsers',
        },
      }, false, {})).toEqual({ label: 'textForAnonymousUsers' });
    });
    it('should return textForNoShipping', () => {
      expect(getShippingLine({
        ...cartConfig,
        shipping: {
          ...cartConfig.shipping,
          textForNoShipping: 'textForNoShipping',
        },
      }, false, { amount: null })).toEqual({ label: 'textForNoShipping' });
    });
    it('should return textForFreeShipping', () => {
      expect(getShippingLine({
        ...cartConfig,
        shipping: {
          ...cartConfig.shipping,
          textForFreeShipping: 'textForFreeShipping',
        },
      }, false, { amount: 0 })).toEqual({
        label: 'titles.shipping',
        amount: 'textForFreeShipping',
        hint: '(incl)',
      });
    });
    it('should return free shipping', () => {
      expect(getShippingLine(cartConfig, false, { amount: 0 })).toEqual({
        label: 'titles.shipping',
        amount: 'shipping.free_short',
        hint: '(incl)',
      });
    });
    it('should return shipping', () => {
      expect(getShippingLine(cartConfig, false, { label: 'DHL', amount: 5 })).toEqual({
        label: 'DHL',
        amount: 5,
        hint: '(incl)',
      });
    });
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
