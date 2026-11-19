import React from 'react';
import { render, screen } from '@testing-library/react';
import CartItemProductPriceList from '../CartItemProductPriceList';

/* eslint-disable react/prop-types */
jest.mock('@shopgate/engage/components', () => ({
  Typography: ({ children }) => children,
  SurroundPortals: ({ portalName, portalProps, children }) => (
    <div
      data-testid={portalName}
      data-price={portalProps.price}
      data-cart-item-id={portalProps.context.cartItemId}
      data-quantity={portalProps.quantity}
      data-subtotal={String(portalProps.isSubtotal)}
    >
      {children}
    </div>
  ),
}));
jest.mock('@shopgate/pwa-ui-shared/Price', () => ({ unitPrice }) => `price ${unitPrice}`);
jest.mock('@shopgate/pwa-ui-shared/PriceStriked', () => ({ value }) => `striked ${value}`);
/* eslint-enable react/prop-types */
jest.mock('../../../cart.helpers', () => ({
  createCartItemPrices: () => ({
    price: [{ price: 10 }],
    subtotal: [{ price: 20 }, { price: 15 }],
  }),
}));
jest.mock('../CartItem.hooks', () => ({
  useCartItem: () => ({
    isOrderDetails: false,
    isCheckoutConfirmation: false,
  }),
  useCartItemProduct: () => ({
    type: 'product',
    cartItemId: 'item-1',
    product: { id: 'product-1' },
    currency: 'EUR',
    cartItem: { quantity: 2 },
  }),
}));

describe('<CartItemProductPriceList />', () => {
  it('wraps the price and the strike price in their portals', () => {
    render(<CartItemProductPriceList isSubtotal />);

    const price = screen.getByTestId('cart.item.price');
    const striked = screen.getByTestId('cart.item.price-striked');

    expect(price).toHaveTextContent('price 15');
    expect(price).toHaveAttribute('data-price', '15');
    expect(price).toHaveAttribute('data-cart-item-id', 'item-1');
    expect(price).toHaveAttribute('data-quantity', '2');
    expect(price).toHaveAttribute('data-subtotal', 'true');
    expect(striked).toHaveTextContent('striked 20');
    expect(striked).toHaveAttribute('data-price', '20');
  });
});
