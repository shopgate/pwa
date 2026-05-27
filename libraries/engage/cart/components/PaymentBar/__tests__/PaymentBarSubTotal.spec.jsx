import React from 'react';
import { render, screen } from '@shopgate/pwa-unit-test/rtlUtils';
import PaymentBarSubTotal from '../PaymentBarSubTotal';
import { CartContext } from '../../../cart.context';

function mockFactories() {
  return jest.requireActual('./mockFactories');
}

jest.mock('../PaymentBarSubTotal.connector', () => cmp => cmp);
jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: mockFactories().createSurroundPortalsMock(),
}));

jest.mock('@shopgate/pwa-ui-shared/CartTotalLine', () =>
  mockFactories().createCartTotalLineMock());

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
    renderWithCartContext(<PaymentBarSubTotal amount={10} />);
    expect(screen.getByTestId('surround-portals')).toBeTruthy();
    expect(screen.getByTestId('cart-total-line')).toBeTruthy();
    expect(screen.getByTestId('cart-total-line-label')).toBeTruthy();
    expect(screen.getByTestId('cart-total-line-amount')).toBeTruthy();
  });
});
