import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentBarSubTotal from '../PaymentBarSubTotal';
import { CartContext } from '../../../cart.context';

function mockFactories() {
  return jest.requireActual('../testUtils/mockFactories');
}

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: selector => selector(),
}));
jest.mock('@shopgate/pwa-common-commerce/cart/selectors', () => ({ getSubTotal: () => 10 }));
jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: mockFactories().createSurroundPortalsMock(),
  CartTotalLine: mockFactories().createCartTotalLineMock(),
}));

jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('<PaymentBarSubTotal>', () => {
  const renderWithCartContext = ui => render(
    <CartContext.Provider
      value={{
        currency: 'EUR',
        isLoading: false,
        hasPromotionCoupons: false,
      }}
    >
      {ui}
    </CartContext.Provider>
  );

  it('should render line', () => {
    renderWithCartContext(<PaymentBarSubTotal />);
    expect(screen.getByTestId('surround-portals')).toBeTruthy();
    expect(screen.getByTestId('cart-total-line')).toBeTruthy();
    expect(screen.getByTestId('cart-total-line-label')).toBeTruthy();
    expect(screen.getByTestId('cart-total-line-amount')).toBeTruthy();
  });
});
