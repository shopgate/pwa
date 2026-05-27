import React from 'react';
import { render, screen } from '@shopgate/pwa-unit-test/rtlUtils';
import PaymentBarGrandTotal from '../PaymentBarGrandTotal';
import { CartContext } from '../../../cart.context';

/* eslint-disable react/prop-types */

function mockFactories() {
  return jest.requireActual('./mockFactories');
}

jest.mock('../PaymentBarGrandTotal.connector', () => cmp => cmp);
jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: mockFactories().createSurroundPortalsMock(),
}));

jest.mock('@shopgate/pwa-ui-shared/CartTotalLine', () => {
  function CartTotalLine(props) {
    const {
      children,
      className,
      isDisabled,
      type,
    } = props;

    return (
      <div
        data-testid="cart-total-line"
        data-type={type}
        data-disabled={String(isDisabled)}
        className={className}
      >
        {children}
      </div>
    );
  }

  CartTotalLine.Label = function Label(props) {
    const { label, showSeparator } = props;

    return (
      <div data-testid="cart-total-line-label" data-separator={String(showSeparator)}>
        {label}
      </div>
    );
  };

  CartTotalLine.Amount = function Amount(props) {
    const { amount, currency } = props;

    return <div data-testid="cart-total-line-amount">{`${amount} ${currency}`}</div>;
  };

  CartTotalLine.Spacer = function Spacer(props) {
    return <div data-testid="cart-total-line-spacer" className={props.className} />;
  };

  return CartTotalLine;
});

describe('<PaymentBarGrandTotal />', () => {
  const renderWithCartContext = (ui, contextValue = {}) => render(
    <CartContext.Provider
      value={{
        config: { hideTotal: false },
        currency: 'EUR',
        isLoading: false,
        hasPromotionCoupons: false,
        ...contextValue,
      }}
    >
      {ui}
    </CartContext.Provider>
  );

  it('should render grand total line with default label and amount', () => {
    renderWithCartContext(<PaymentBarGrandTotal amount={10} />);

    expect(screen.getByTestId('surround-portals')).toBeTruthy();
    expect(screen.getByTestId('cart-total-line')).toHaveAttribute('data-type', 'grandTotal');
    expect(screen.getByTestId('cart-total-line')).toHaveAttribute('data-disabled', 'false');
    expect(screen.getByTestId('cart-total-line-label')).toHaveTextContent('cart.total');
    expect(screen.getByTestId('cart-total-line-label')).toHaveAttribute('data-separator', 'true');
    expect(screen.getByTestId('cart-total-line-amount')).toHaveTextContent('10 EUR');
  });

  it('should not render when hideTotal is enabled', () => {
    const { container } = renderWithCartContext(
      <PaymentBarGrandTotal amount={10} />,
      { config: { hideTotal: true } }
    );

    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId('cart-total-line')).toBeNull();
  });

  it('should render spacer when promotion coupons are present', () => {
    renderWithCartContext(
      <PaymentBarGrandTotal amount={10} />,
      { hasPromotionCoupons: true }
    );

    expect(screen.getByTestId('cart-total-line-spacer')).toBeTruthy();
  });
});

/* eslint-enable react/prop-types */
