import React from 'react';
import { render, screen } from '@testing-library/react';
import { getTaxLine } from '@shopgate/pwa-common-commerce/cart';
import { getTax } from '@shopgate/pwa-common-commerce/cart/selectors';
import PaymentBarTax from '../PaymentBarTax';
import { CartContext } from '../../../cart.context';

function mockFactories() {
  return jest.requireActual('../testUtils/mockFactories');
}

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: selector => selector(),
}));
jest.mock('@shopgate/pwa-common-commerce/cart/selectors', () => ({ getTax: jest.fn() }));
jest.mock('@shopgate/pwa-common-commerce/cart', () => ({
  CART_PAYMENT_BAR_TOTALS_TAX: 'CART_PAYMENT_BAR_TOTALS_TAX',
  getTaxLine: jest.fn(() => ({
    label: 'Tax',
    amount: 10,
    hint: null,
  })),
}));
jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: mockFactories().createSurroundPortalsMock(),
  CartTotalLine: mockFactories().createCartTotalLineMock(),
}));

describe('<PaymentBarTax />', () => {
  const renderWithCartContext = ui => render(
    <CartContext.Provider
      value={{
        currency: 'EUR',
        isLoading: false,
        hasPromotionCoupons: false,
        config: {
          hideTax: false,
          tax: {
            text: null,
            hint: null,
          },
        },
      }}
    >
      {ui}
    </CartContext.Provider>
  );

  it('should render when taxData is provided', () => {
    // eslint-disable-next-line extra-rules/no-single-line-objects
    const taxData = { label: 'Tax', amount: 10 };
    getTax.mockReturnValue(taxData);
    renderWithCartContext(<PaymentBarTax />);
    expect(getTaxLine).toHaveBeenCalledWith(
      {
        hideTax: false,
        tax: {
          text: null,
          hint: null,
        },
      },
      taxData
    );
    expect(screen.getByTestId('cart-total-line')).toBeTruthy();
    expect(screen.getByTestId('cart-total-line-label')).toBeTruthy();
    expect(screen.getByTestId('cart-total-line-amount')).toBeTruthy();
    expect(screen.getByTestId('cart-total-line-hint')).toBeTruthy();
  });
  it('should not render when taxData is null', () => {
    getTax.mockReturnValue(null);
    const { container } = renderWithCartContext(<PaymentBarTax />);
    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId('cart-total-line')).toBeNull();
  });
});
