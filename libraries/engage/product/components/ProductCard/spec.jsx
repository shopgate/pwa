import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from './index';

let mockActionButtons = {};

jest.mock('react-redux', () => ({
  useSelector: selector => selector(),
}));
jest.mock('@shopgate/engage/settings/selectors/appSettings', () => ({
  getProductCardNameMaxLines: () => 2,
  getProductActionButtons: () => mockActionButtons,
}));
jest.mock('@shopgate/engage/core/helpers', () => ({
  isBeta: () => false,
}));
jest.mock('@shopgate/engage/product/hooks', () => ({
  useProductListType: () => ({ meta: {} }),
  useShowEmptyRatingStars: () => false,
}));
jest.mock('@shopgate/engage/product', () => ({
  getProductRoute: id => `/item/${id}`,
}));
jest.mock('@shopgate/engage/category', () => ({
  PRODUCT_ITEM_DISCOUNT: 'discount',
  PRODUCT_ITEM_PRICE: 'price',
}));
/* eslint-disable react/prop-types */
jest.mock('@shopgate/engage/components', () => ({
  Link: ({ children }) => <div>{children}</div>,
  RatingStars: () => null,
  DiscountBadge: () => null,
  SurroundPortals: ({ children }) => children,
}));
jest.mock('@shopgate/engage/product/components', () => ({
  MapPriceHint: () => null,
  ProductImage: () => null,
  OrderQuantityHint: () => null,
  FeaturedMedia: () => null,
  Swatches: () => null,
  ProductName: () => null,
  ProductBadges: ({ children }) => children,
}));
jest.mock('../ProductGridPrice', () => () => null);
jest.mock('../ProductTileActions', () => ({
  ProductTileActions: ({ hideFavorites, hideAddToCart }) => (
    <div
      data-testid="tile-actions"
      data-hide-favorites={String(hideFavorites)}
      data-hide-add-to-cart={String(hideAddToCart)}
    />
  ),
}));
jest.mock('../ProductCardAddToCart', () => ({
  ProductCardAddToCart: () => <button type="button">cart</button>,
}));
/* eslint-enable react/prop-types */

const product = {
  id: 'p1',
  name: 'Product',
  price: { discount: 0 },
};

describe('<ProductCard />', () => {
  it('shows the buttons configured in the app settings by default', () => {
    mockActionButtons = { addToCart: 'button' };
    render(<ProductCard product={product} />);

    const actions = screen.getByTestId('tile-actions');
    expect(actions).toHaveAttribute('data-hide-favorites', 'false');
    expect(actions).toHaveAttribute('data-hide-add-to-cart', 'false');
    expect(screen.getByRole('button', { name: 'cart' })).toBeInTheDocument();
  });

  it('passes hideFavorites and hideAddToCart to the tile actions', () => {
    mockActionButtons = { addToCart: 'actionButton' };
    render(<ProductCard product={product} hideFavorites hideAddToCart />);

    const actions = screen.getByTestId('tile-actions');
    expect(actions).toHaveAttribute('data-hide-favorites', 'true');
    expect(actions).toHaveAttribute('data-hide-add-to-cart', 'true');
  });

  it('hides the add to cart button below the card', () => {
    mockActionButtons = { addToCart: 'button' };
    render(<ProductCard product={product} hideAddToCart />);

    expect(screen.queryByRole('button', { name: 'cart' })).not.toBeInTheDocument();
  });
});
