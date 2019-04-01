import { getCartConfig } from './config';

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  cartShippingHideAnonymousLegacy: true,
  cartShippingTextAnonymousLegacy: 'cartShippingTextAnonymousLegacy',
  cartTaxText: 'cartTaxText',
  cart: {
    hideTotal: false,
    hideShipping: false,
    hideTax: false,
    shipping: {
      hideFreeShipping: false,
      hideAnonymous: null,
      textForAnonymousUsers: null,
      textForFreeShipping: null,
      textForNoShipping: null,
      hint: null,
    },
    tax: {
      text: null,
      hint: null,
    },
  },
}));

describe('Cart helper config', () => {
  it('should create config', () => {
    expect(getCartConfig()).toEqual({
      hideTotal: false,
      hideShipping: false,
      hideTax: false,
      shipping: {
        hideFreeShipping: false,
        hideAnonymous: true,
        textForAnonymousUsers: 'cartShippingTextAnonymousLegacy',
        textForFreeShipping: null,
        textForNoShipping: null,
        hint: null,
      },
      tax: {
        text: 'cartTaxText',
        hint: null,
      },
    });
  });
});
