import { i18n } from '@shopgate/engage/core/helpers';
import { getTotalLabel } from './totalLabel';

jest.mock('@shopgate/engage/core/helpers', () => ({
  i18n: {
    // By default behave like an unresolved key: echo the key back.
    text: jest.fn(key => key),
  },
}));

describe('Cart helper getTotalLabel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    i18n.text.mockImplementation(key => key);
  });

  it('should return the fallback key when no label is provided', () => {
    expect(getTotalLabel(undefined, 'titles.shipping')).toBe('titles.shipping');
    expect(getTotalLabel('', 'titles.shipping')).toBe('titles.shipping');
    expect(i18n.text).not.toHaveBeenCalled();
  });

  it('should keep a plain literal label untouched (no i18n lookup)', () => {
    expect(getTotalLabel('DHL', 'titles.shipping')).toBe('DHL');
    expect(getTotalLabel('incl 19%', 'checkout.summary.tax')).toBe('incl 19%');
    expect(i18n.text).not.toHaveBeenCalled();
  });

  it('should fall back when the label is an unresolved i18n key', () => {
    expect(getTotalLabel('ApiteSW6Utility.cart.summaryShipping', 'titles.shipping'))
      .toBe('titles.shipping');
    expect(i18n.text).toHaveBeenCalledWith('ApiteSW6Utility.cart.summaryShipping');
  });

  it('should keep the backend label when the i18n key resolves', () => {
    i18n.text.mockImplementation(() => 'Versandkosten');
    expect(getTotalLabel('ApiteSW6Utility.cart.summaryShipping', 'titles.shipping'))
      .toBe('ApiteSW6Utility.cart.summaryShipping');
  });
});
