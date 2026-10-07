import { render, act } from '@testing-library/react';
import { ProductContext } from '@shopgate/engage/product/contexts';
import Content from './index';

jest.mock('@shopgate/engage/a11y', () => ({
  Section: ({ children }) => children,
}));
jest.mock('@shopgate/engage/reviews', () => ({
  Reviews: () => null,
}));
jest.mock('@shopgate/engage/product/components', () => ({
  ProductProperties: () => null,
  RelationsSlider: () => null,
  Description: () => null,
  UnitQuantityPickerWithSection: () => null,
  OrderQuantityHint: () => null,
  Options: () => null,
  Characteristics: () => null,
}));
jest.mock('@shopgate/engage/product/contexts', () => ({
  ProductContext: {
    Provider: jest.fn(({ children }) => children),
  },
}));
jest.mock('@shopgate/engage/product');
jest.mock('@shopgate/engage/locations', () => ({
  FulfillmentSelector: () => null,
  FulfillmentSheet: () => null,
  FulfillmentPathSelector: () => null,
}));
jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/pwa-core', () => ({
  Conditioner: jest.fn(),
  hasSGJavaScriptBridge: jest.fn().mockReturnValue(false),
}));

jest.mock('@shopgate/pwa-ui-shared/TaxDisclaimer', () => () => null);

jest.mock('../Media', () => () => null);
jest.mock('../Header', () => () => null);
jest.mock('../AppBar', () => () => null);
jest.mock('../AddToCartBar', () => () => null);
jest.mock('./connector', () => Component => Component);

describe('Product / Content', () => {
  const expectedContext = {
    productId: 'SG100',
    quantity: 1,
    options: {},
    optionsPrices: {},
  };

  const getContextValue = () => ProductContext.Provider.mock.lastCall[0].value;

  beforeEach(() => {
    ProductContext.Provider.mockClear();
  });

  it('should provide correct context value', () => {
    render(<Content productId="SG100" />);

    expect(getContextValue()).toEqual(expect.objectContaining(expectedContext));
  });

  it('should reset options on product update', () => {
    const { rerender } = render(<Content productId="SG100" />);

    act(() => {
      getContextValue().setOption('op1', 'OP_V', 0);
    });

    expect(getContextValue()).toEqual(expect.objectContaining({
      ...expectedContext,
      options: { op1: 'OP_V' },
      optionsPrices: { op1: 0 },
    }));

    rerender(<Content productId="SG200" />);

    expect(getContextValue()).toEqual(expect.objectContaining({
      ...expectedContext,
      productId: 'SG200',
    }));
  });
});
