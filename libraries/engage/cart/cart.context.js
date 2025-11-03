import { createContext } from 'react';

/**
 * @typedef {Object} CartConfig
 * @property {Object} shipping
 * @property {boolean|null} shipping.hideAnonymous
 * @property {string|null} shipping.textForAnonymousUsers
 * @property {Object} tax
 * @property {string|null} tax.text
 * @property {Object<string, any>} [otherProperties] Additional properties from the cart object.
 */

/**
 * @typedef {Object} CartContextProps
 * @property {string} currency
 * @property {CartConfig} config
 * @property {boolean} isUserLoggedIn
 * @property {boolean} isLoading
 * @property {Object<string, any>} flags
 * @property {'line' | 'card'} display
 * @property {boolean} hasPromotionCoupons
 */

export const CartContext = createContext(/** @type {CartContextProps} */ ({
  currency: 'EUR',
  config: {
    shipping: {
      hideAnonymous: null,
      textForAnonymousUsers: null,
    },
    tax: {
      text: null,
    },
  },
  isUserLoggedIn: false,
  isLoading: false,
  flags: {},
  display: 'card',
  hasPromotionCoupons: false,
}));
