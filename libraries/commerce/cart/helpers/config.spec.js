import { getCartConfig } from './config';

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  cartShippingHideAnonymousLegacy: true,
  cartShippingTextAnonymousLegacy: 'cartShippingTextAnonymousLegacy',
  cart: {
    hideTotal: false,
    hideShipping: false,
    shipping: {
      hideFreeShipping: false,
      hideAnonymous: null,
      textForAnonymousUsers: null,
      textForFreeShipping: null,
      textForNoShipping: null,
      hint: null,
    },
  },
}));

describe('Cart helper config', () => {
  it('should create config', () => {
    expect(getCartConfig()).toEqual({
      hideTotal: false,
      hideShipping: false,
      shipping: {
        hideFreeShipping: false,
        hideAnonymous: true,
        textForAnonymousUsers: 'cartShippingTextAnonymousLegacy',
        textForFreeShipping: null,
        textForNoShipping: null,
        hint: null,
      },
    });
  });
});
