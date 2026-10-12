import type { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { render } from '@testing-library/react';
import ProductListEntryProvider from '../providers/ProductListEntry';
import { getProduct } from '../selectors/product';
import useProductListEntryProduct from './useProductListEntryProduct';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('../selectors/product', () => ({
  getProduct: jest.fn(),
}));

const mockedUseSelector = useSelector as unknown as jest.Mock;
const mockedGetProduct = getProduct as unknown as jest.Mock;
const state = {};

/**
 * A product type without an index signature, as an extension would declare it.
 */
interface TestProduct {
  id: string;
  name?: string;
}

const products: Record<string, TestProduct> = {
  p1: {
    id: 'p1',
    name: 'Product p1',
  },
};

/**
 * Renders a component that reads the product of the product list entry.
 * @param product A product to pass to the hook.
 * @param wrap Wraps the reading component, e.g. with a provider.
 * @returns The value returned by the hook.
 */
const readProduct = (
  product?: TestProduct,
  wrap: (children: ReactElement) => ReactElement = children => children
): TestProduct | null => {
  let value: TestProduct | null = null;

  const Reader = () => {
    value = useProductListEntryProduct<TestProduct>(product);
    return null;
  };

  render(wrap(<Reader />));
  return value;
};

/**
 * Wraps the children with a product list entry.
 * @param children The children to wrap.
 * @returns The wrapped children.
 */
const withEntry = (children: ReactElement) => (
  <ProductListEntryProvider productId="p1">
    {children}
  </ProductListEntryProvider>
);

describe('engage > product > hooks > useProductListEntryProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseSelector.mockImplementation(selector => selector(state));
    mockedGetProduct.mockImplementation((_, { productId }) => products[productId] || null);
  });

  it('should return the product of the product list entry', () => {
    expect(readProduct(undefined, withEntry)).toEqual({
      id: 'p1',
      name: 'Product p1',
    });
    expect(mockedGetProduct).toHaveBeenCalledWith(state, { productId: 'p1' });
  });

  it('should return a passed product that belongs to the entry', () => {
    const product = {
      id: 'p1',
      name: 'From props',
    };

    expect(readProduct(product, withEntry)).toBe(product);
    expect(mockedGetProduct).not.toHaveBeenCalled();
  });

  it('should ignore a passed product of another entry', () => {
    expect(readProduct({ id: 'p2' }, withEntry)).toEqual({
      id: 'p1',
      name: 'Product p1',
    });
  });

  it('should return null outside of a product list entry', () => {
    expect(readProduct({ id: 'p2' })).toBeNull();
  });
});
