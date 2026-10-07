import { render } from '@testing-library/react';
import { SurroundPortals, Price as PriceBase } from '@shopgate/engage/components';
import Price from './index';

jest.mock('@shopgate/engage/product/contexts', () => ({
  ProductContext: {
    Consumer: ({ children }) => children({}),
  },
}));
jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: jest.fn(({ children }) => children),
  PlaceholderLabel: ({ children }) => children,
  Price: jest.fn(() => null),
}));
jest.mock('./connector', () => cmp => cmp);

describe('<Price />', () => {
  const price = {
    unitPrice: 90.5,
    unitPriceMin: 80.5,
    discount: 0,
    currency: 'USD',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render portals', () => {
    render(<Price price={price} hasProductVariants />);

    expect(SurroundPortals.mock.lastCall[0]).toEqual(expect.objectContaining({
      portalName: 'product.price',
      portalProps: {
        price,
        hasProductVariants: true,
      },
    }));
  });

  it('should pass unitPriceMin for variants', () => {
    render(<Price price={price} hasProductVariants />);

    expect(PriceBase.mock.lastCall[0]).toEqual(expect.objectContaining({
      currency: 'USD',
      discounted: false,
      taxDisclaimer: true,
      unitPrice: 90.5,
      unitPriceMin: price.unitPriceMin,
    }));
  });

  it('should not pass unitPriceMin for non variants', () => {
    render(<Price price={price} hasProductVariants={false} />);

    expect(PriceBase.mock.lastCall[0]).toEqual(expect.objectContaining({
      currency: 'USD',
      discounted: false,
      taxDisclaimer: true,
      unitPrice: 90.5,
      unitPriceMin: 0,
    }));
  });
});
