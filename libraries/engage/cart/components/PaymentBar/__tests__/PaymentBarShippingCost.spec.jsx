import React from 'react';
import { render, screen } from '@shopgate/pwa-unit-test/rtlUtils';
import { getShippingLine } from '@shopgate/pwa-common-commerce/cart';
import PaymentBarShippingCost from '../PaymentBarShippingCost';
import { CartContext } from '../../../cart.context';

function mockFactories() {
  return jest.requireActual('../testUtils/mockFactories');
}

jest.mock('@shopgate/pwa-common-commerce/cart', () => ({
  getShippingLine: jest.fn(),
}));
jest.mock('../PaymentBarShippingCost.connector', () => cmp => cmp);
jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: mockFactories().createSurroundPortalsMock(),
}));

jest.mock('@shopgate/pwa-ui-shared/CartTotalLine', () =>
  mockFactories().createCartTotalLineMock());

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
    getShippingLine.mockReturnValue(shippingLine);

    renderWithCartContext(<PaymentBarShippingCost shippingCost={shippingCost} />);

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
    renderWithCartContext((
      <PaymentBarShippingCost
        shippingCost={{
          amount: 10,
          label: 'Label',
        }}
      />
    ));
    expect(screen.queryByTestId('cart-total-line')).toBeNull();
  });
});
