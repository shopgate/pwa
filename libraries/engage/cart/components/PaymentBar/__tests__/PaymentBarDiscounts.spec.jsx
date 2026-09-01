/* eslint-disable react/prop-types */
import React from 'react';
import { render } from '@testing-library/react';
import PaymentBarDiscounts from '../PaymentBarDiscounts';
import { CartContext } from '../../../cart.context';

jest.mock('../PaymentBarDiscounts.connector', () => cmp => cmp);
jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: ({ children }) => children,
  I18n: {
    Text: ({ string, params }) => <span>{params?.label ? `${string} ${params.label}` : string}</span>,
    Price: ({ price, currency }) => <span>{`${price} ${currency}`}</span>,
  },
}));

jest.mock('@shopgate/pwa-common-commerce/cart', () => ({
  CART_PAYMENT_BAR_TOTALS_DISCOUNTS: 'CART_PAYMENT_BAR_TOTALS_DISCOUNTS',
}));

describe('<PaymentBarDiscounts />', () => {
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

  it('should render discount labels and signed amounts', () => {
    const discounts = [
      {
        label: 'Coupon',
        amount: 10,
      },
      {
        label: '',
        amount: 2,
      },
    ];
    const { container } = renderWithCartContext(<PaymentBarDiscounts discounts={discounts} />);

    expect(container.querySelectorAll('[data-test-id="discountCartTotal"]')).toHaveLength(2);
    expect(container).toHaveTextContent('cart.discount_with_label Coupon:');
    expect(container).toHaveTextContent('cart.discount:');
    expect(container).toHaveTextContent('-10 EUR');
    expect(container).toHaveTextContent('-2 EUR');
  });

  it('should be empty render', () => {
    const { container } = renderWithCartContext(<PaymentBarDiscounts discounts={null} />);
    expect(container.firstChild).toBeNull();
  });
});
/* eslint-enable react/prop-types */
