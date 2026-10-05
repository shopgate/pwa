import { render, screen } from '@testing-library/react';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { Availability, Link } from '@shopgate/engage/components';
import { StockInfoLists } from '@shopgate/engage/locations/components';
import {
  MapPriceHint,
  OrderQuantityHint,
  EffectivityDates,
  Swatches,
} from '@shopgate/engage/product';
import ItemName from '../ItemName';
import ItemPrice from '../ItemPrice';
import ItemDetails from './index';

jest.mock('@shopgate/engage/product', () => ({
  MapPriceHint: jest.fn(() => null),
  OrderQuantityHint: jest.fn(() => null),
  EffectivityDates: jest.fn(() => null),
  Swatches: jest.fn(() => null),
  AVAILABILITY_STATE_OK: 'AVAILABILITY_STATE_OK',
  AVAILABILITY_STATE_ALERT: 'AVAILABILITY_STATE_ALERT',
  getProductRoute: jest.fn(productId => `link-to-product/${productId}`),
}));
jest.mock('@shopgate/engage/locations/components', () => ({
  StockInfoLists: jest.fn(() => null),
}));
jest.mock('@shopgate/engage/core/helpers', () => ({
  hasNewServices: jest.fn().mockReturnValue(false),
  i18n: {
    text: str => str,
  },
}));
jest.mock('@shopgate/engage/components', () => ({
  Availability: jest.fn(() => null),
  Link: jest.fn(({ href, className, children }) => (
    <a href={href} className={className}>{children}</a>
  )),
}));
jest.mock('@shopgate/engage/core', () => ({
  isIOSTheme: jest.fn().mockReturnValue(true),
  hasWebBridge: jest.fn().mockReturnValue(false),
  i18n: {
    text: text => text,
  },
}));
jest.mock('../ItemName', () => jest.fn(() => null));
jest.mock('../ItemPrice', () => jest.fn(() => null));

describe('<ItemDetails />', () => {
  const props = {
    product: {
      id: '1234',
      name: 'Foo',
      price: {},
    },
  };

  const display = {
    name: false,
    price: false,
    reviews: false,
  };

  const expectCommonContent = () => {
    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('href', 'link-to-product/1234');
    expect(link).toHaveClass('theme__product-grid__item__item-details');
    expect(Link.mock.lastCall[0]).toEqual(expect.objectContaining({
      state: { title: 'Foo' },
      tabIndex: 0,
    }));
    expect(Swatches.mock.lastCall[0]).toEqual({ productId: '1234' });
    expect(ItemName.mock.lastCall[0]).toEqual({
      display: null,
      name: 'Foo',
      productId: '1234',
    });
    expect(MapPriceHint.mock.lastCall[0]).toEqual({ productId: '1234' });
    expect(OrderQuantityHint.mock.lastCall[0]).toEqual({
      productId: '1234',
      className: expect.stringContaining('quantityHint'),
    });
    expect(EffectivityDates.mock.lastCall[0]).toEqual({ productId: '1234' });
    expect(ItemPrice.mock.lastCall[0]).toEqual({
      display: null,
      product: props.product,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with minimal props', () => {
    render(<ItemDetails {...props} />);
    expectCommonContent();
    expect(Availability).not.toHaveBeenCalled();
    expect(StockInfoLists).not.toHaveBeenCalled();
  });

  it('should render additional components with new services', () => {
    hasNewServices.mockReturnValueOnce(true);
    render(<ItemDetails {...props} />);
    expectCommonContent();
    expect(Availability.mock.lastCall[0]).toEqual({
      showWhenAvailable: false,
      state: 'AVAILABILITY_STATE_OK',
      text: 'product.available.not',
    });
    expect(StockInfoLists.mock.lastCall[0]).toEqual({ product: props.product });
  });

  it('should not render with display props set', () => {
    const { container } = render(<ItemDetails {...props} display={display} />);
    expect(container).toBeEmptyDOMElement();
  });
});
