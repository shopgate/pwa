import type { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { render } from '@testing-library/react';
import ProductListEntryProvider from '../providers/ProductListEntry';
import { getProduct } from '../selectors/product';
import useProductListEntryProduct, {
  type ProductListEntryWithProduct,
} from './useProductListEntryProduct';

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
 * Renders a component that reads the product list entry and its product.
 * @param product A product to pass to the hook.
 * @param wrap Wraps the reading component, e.g. with a provider.
 * @returns The value returned by the hook.
 */
const readEntry = (
  product?: TestProduct,
  wrap: (children: ReactElement) => ReactElement = children => children
): ProductListEntryWithProduct<TestProduct> => {
  let value = {} as ProductListEntryWithProduct<TestProduct>;

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

  it('should return the product list entry and its product', () => {
    expect(readEntry(undefined, withEntry)).toEqual({
      product: {
        id: 'p1',
        name: 'Product p1',
      },
      productListEntry: {
        productId: 'p1',
        productListType: null,
        productListSubType: null,
      },
    });
    expect(mockedGetProduct).toHaveBeenCalledWith(state, { productId: 'p1' });
  });

  it('should return a passed product that belongs to the entry', () => {
    const product = {
      id: 'p1',
      name: 'From props',
    };

    expect(readEntry(product, withEntry).product).toBe(product);
    expect(mockedGetProduct).not.toHaveBeenCalled();
  });

  it('should ignore a passed product of another entry', () => {
    expect(readEntry({ id: 'p2' }, withEntry).product).toEqual({
      id: 'p1',
      name: 'Product p1',
    });
  });

  it('should return no product and an empty entry outside of a product list entry', () => {
    expect(readEntry({ id: 'p2' })).toEqual({
      product: null,
      productListEntry: {
        productId: null,
        productListType: null,
        productListSubType: null,
      },
    });
  });
});
