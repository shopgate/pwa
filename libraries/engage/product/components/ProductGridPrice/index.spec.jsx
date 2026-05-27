import React from 'react';
import { render, screen } from '@shopgate/pwa-unit-test/rtlUtils';
import ProductGridPrice from './index';

const mockPriceInfo = jest.fn(() => <div data-testid="price-info" />);

jest.mock('@shopgate/engage/product/hocs', () => ({
  withPriceCalculation: component => component,
}));

jest.mock('@shopgate/engage/core/helpers/i18n', () => ({
  i18n: {
    text: input => input,
    price: input => input,
    ready: true,
  },
}));

/* eslint-disable react/prop-types */
jest.mock('@shopgate/engage/components', () => {
  const Grid = ({ children }) => <div data-testid="grid">{children}</div>;
  Grid.Item = ({ children }) => <div data-testid="grid-item">{children}</div>;

  return {
    Grid,
    Price: ({
      currency,
      unitPrice,
      unitPriceMin,
      discounted,
    }) => (
      <div
        data-testid="price"
        data-currency={currency}
        data-unit-price={String(unitPrice)}
        data-unit-price-min={String(unitPriceMin)}
        data-discounted={String(discounted)}
      />
    ),
    PriceStriked: ({ currency, value }) => (
      <div data-testid="price-striked" data-currency={currency} data-value={String(value)} />
    ),
  };
});
/* eslint-enable react/prop-types */
jest.mock('@shopgate/engage/product/components', () => ({
  PriceInfo: props => mockPriceInfo(props),
}));

const mockPrice = {
  currency: 'EUR',
  msrp: 0,
  discount: 0,
  unitPrice: 22.95,
  unitPriceMin: 22.95,
  unitPriceStriked: 0,
  info: 'PriceInfoString',
};

const mockPriceStriked = {
  currency: 'EUR',
  msrp: 0,
  discount: 52,
  unitPrice: 10.95,
  unitPriceMin: 10.95,
  unitPriceStriked: 22.95,
  info: '',
};

const mockPriceMsrp = {
  currency: 'EUR',
  msrp: 22.95,
  discount: 52,
  unitPrice: 10.95,
  unitPriceMin: 10.95,
  unitPriceStriked: 0,
  info: 'PriceInfoString',
};

describe('<ProductGridPrice />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without discounts', () => {
    const product = {
      price: mockPrice,
    };

    const { container } = render(<ProductGridPrice product={product} />);
    const price = screen.getByTestId('price');

    expect(container.firstChild).toBeTruthy();
    expect(price.getAttribute('data-currency')).toBe(mockPrice.currency);
    expect(price.getAttribute('data-unit-price')).toBe(String(mockPrice.unitPrice));
    expect(price.getAttribute('data-unit-price-min')).toBe(String(mockPrice.unitPriceMin));
    expect(price.getAttribute('data-discounted')).toBe('false');
    expect(screen.queryAllByTestId('price-striked')).toHaveLength(0);
    expect(screen.getByTestId('price-info')).toBeTruthy();
    expect(mockPriceInfo).toHaveBeenCalledWith(expect.objectContaining({ product }));
  });

  it('should render with strike price', () => {
    const product = {
      price: mockPriceStriked,
    };
    const { container } = render(<ProductGridPrice product={product} />);
    const price = screen.getByTestId('price');
    const [priceStriked] = screen.getAllByTestId('price-striked');

    expect(container.firstChild).toBeTruthy();
    expect(price.getAttribute('data-currency')).toBe(mockPriceStriked.currency);
    expect(price.getAttribute('data-unit-price')).toBe(String(mockPriceStriked.unitPrice));
    expect(price.getAttribute('data-unit-price-min')).toBe(String(mockPriceStriked.unitPriceMin));
    expect(price.getAttribute('data-discounted')).toBe('true');
    expect(priceStriked.getAttribute('data-currency')).toBe(mockPriceStriked.currency);
    expect(priceStriked.getAttribute('data-value')).toBe(String(mockPriceStriked.unitPriceStriked));
    expect(screen.getByTestId('price-info')).toBeTruthy();
    expect(mockPriceInfo).toHaveBeenCalledWith(expect.objectContaining({ product }));
  });

  it('should render with msrp', () => {
    const product = {
      price: mockPriceMsrp,
    };

    const { container } = render(<ProductGridPrice product={product} />);
    const price = screen.getByTestId('price');
    const [priceStriked] = screen.getAllByTestId('price-striked');

    expect(container.firstChild).toBeTruthy();
    expect(price.getAttribute('data-currency')).toBe(mockPriceMsrp.currency);
    expect(price.getAttribute('data-unit-price')).toBe(String(mockPriceMsrp.unitPrice));
    expect(price.getAttribute('data-unit-price-min')).toBe(String(mockPriceMsrp.unitPriceMin));
    expect(price.getAttribute('data-discounted')).toBe('true');
    expect(priceStriked.getAttribute('data-currency')).toBe(mockPriceMsrp.currency);
    expect(priceStriked.getAttribute('data-value')).toBe(String(mockPriceMsrp.msrp));
    expect(screen.getByTestId('price-info')).toBeTruthy();
    expect(mockPriceInfo).toHaveBeenCalledWith(expect.objectContaining({ product }));
  });
});
