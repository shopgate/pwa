import React from 'react';
import { render, screen } from '@shopgate/pwa-unit-test/rtlUtils';
import { getTaxLine } from '@shopgate/pwa-common-commerce/cart';
import PaymentBarTax from '../PaymentBarTax';
import { CartContext } from '../../../cart.context';

function mockFactories() {
  return jest.requireActual('../testUtils/mockFactories');
}

jest.mock('../PaymentBarTax.connector', () => cmp => cmp);
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
}));

jest.mock('@shopgate/pwa-ui-shared/CartTotalLine', () =>
  mockFactories().createCartTotalLineMock());

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
    renderWithCartContext(<PaymentBarTax taxData={taxData} />);
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
    const { container } = renderWithCartContext(<PaymentBarTax taxData={null} />);
    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId('cart-total-line')).toBeNull();
  });
});
