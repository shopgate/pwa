import { getCountAriaLabel } from './countAriaLabel';

jest.mock('@shopgate/engage/core/helpers/i18n', () => ({
  i18n: { text: (key: string) => `translated ${key}` },
}));

describe('getCountAriaLabel', () => {
  it('follows the label with the number of products', () => {
    expect(getCountAriaLabel('Cart', 3)).toBe('Cart. translated common.products: 3.');
  });

  it('announces a count of 0', () => {
    expect(getCountAriaLabel('Favorites', 0)).toBe('Favorites. translated common.products: 0.');
  });
});
