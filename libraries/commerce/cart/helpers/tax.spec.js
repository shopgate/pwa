/* eslint-disable extra-rules/no-single-line-objects */
import { getTaxLine } from './tax';

jest.mock('@shopgate/engage/core/helpers', () => ({
  // Behave like an unresolved i18n key: echo the key back.
  i18n: { text: jest.fn(key => key) },
}));

describe('Cart helper tax', () => {
  const cartConfig = {
    hideTax: false,
    tax: {
      text: null,
      hint: '(incl)',
    },
  };

  describe('Should return null', () => {
    it('should return null on empty tax cost', () => {
      expect(getTaxLine(cartConfig)).toBeNull();
    });
    it('should return null on empty tax amount', () => {
      expect(getTaxLine(cartConfig, { amount: 0 })).toBeNull();
    });
    it('should return null on hideTax', () => {
      expect(getTaxLine({ hideTax: true }, {})).toBeNull();
    });
  });

  describe('Should return tax', () => {
    it('should return custom text', () => {
      expect(getTaxLine({
        ...cartConfig,
        tax: {
          ...cartConfig.tax,
          text: 'taxText',
        },
      }, { amount: 5 })).toEqual({
        amount: 'taxText',
        hint: '(incl)',
      });
    });
    it('should return tax', () => {
      expect(getTaxLine(cartConfig, { amount: 5, label: 'incl 19%' })).toEqual({
        label: 'incl 19%',
        amount: 5,
        hint: '(incl)',
      });
    });
    it('should fall back to checkout.summary.tax when the backend label is an unresolved i18n key', () => {
      expect(getTaxLine(cartConfig, { amount: 5, label: 'ApiteSW6Utility.cart.summaryTax' })).toEqual({
        label: 'checkout.summary.tax',
        amount: 5,
        hint: '(incl)',
      });
    });
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
