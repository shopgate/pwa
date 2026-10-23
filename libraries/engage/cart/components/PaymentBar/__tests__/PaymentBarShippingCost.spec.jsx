import React from 'react';
import { render, screen } from '@testing-library/react';
import { getShippingLine } from '@shopgate/pwa-common-commerce/cart';
import { getShippingCost } from '@shopgate/pwa-common-commerce/cart/selectors';
import PaymentBarShippingCost from '../PaymentBarShippingCost';
import { CartContext } from '../../../cart.context';

function mockFactories() {
  return jest.requireActual('../testUtils/mockFactories');
}

jest.mock('@shopgate/pwa-common-commerce/cart', () => ({
  getShippingLine: jest.fn(),
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: selector => selector(),
}));
jest.mock('@shopgate/pwa-common-commerce/cart/selectors', () => ({ getShippingCost: jest.fn() }));
jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: mockFactories().createSurroundPortalsMock(),
  CartTotalLine: mockFactories().createCartTotalLineMock(),
}));

describe('<PaymentBarShippingCost>', () => {
  const renderWithCartContext = ui => render(
    <CartContext.Provider
      value={{
        currency: 'EUR',
        isLoading: false,
        isUserLoggedIn: false,
        hasPromotionCoupons: false,
        config: {
          shipping: {
            hideAnonymous: null,
            textForAnonymousUsers: null,
          },
        },
      }}
    >
      {ui}
    </CartContext.Provider>
  );

  it('should render shipping line', () => {
    const shippingCost = {
      amount: 10,
      label: 'Label',
    };
    const shippingLine = {
      label: 'My label',
      amount: 10,
    };
    getShippingCost.mockReturnValue(shippingCost);
    getShippingLine.mockReturnValue(shippingLine);

    renderWithCartContext(<PaymentBarShippingCost />);

    expect(getShippingLine).toHaveBeenCalledWith(
      {
        shipping: {
          hideAnonymous: null,
          textForAnonymousUsers: null,
        },
      },
      false,
      shippingCost
    );
    expect(screen.getByTestId('cart-total-line')).toBeTruthy();
    expect(screen.getByTestId('cart-total-line-label')).toBeTruthy();
    expect(screen.getByTestId('cart-total-line-amount')).toBeTruthy();
    expect(screen.getByTestId('cart-total-line-hint')).toBeTruthy();
  });
  it('should not render shipping line', () => {
    getShippingLine.mockReturnValue(null);
    getShippingCost.mockReturnValue({
      amount: 10,
      label: 'Label',
    });
    renderWithCartContext(<PaymentBarShippingCost />);
    expect(screen.queryByTestId('cart-total-line')).toBeNull();
  });
});
