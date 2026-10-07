import React from 'react';
import { render } from '@testing-library/react';
import PaymentBarCheckoutButton from '../PaymentBarCheckoutButton';
import { CartContext } from '../../../cart.context';

function mockFactories() {
  return jest.requireActual('../testUtils/mockFactories');
}

const mockText = jest.fn(() => <div data-testid="text" />);

jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: mockFactories().createSurroundPortalsMock(),
  I18n: {
    Text: props => mockText(props),
    // eslint-disable-next-line react/prop-types
    Price: ({ price, currency }) => <span data-testid="price">{`${price} ${currency}`}</span>,
  },
}));

jest.mock('@shopgate/engage/components/v2', () => ({
  Button: mockFactories().createButtonMock(),
}));

jest.mock('../PaymentBarCheckoutButton.connector', () => cmp => cmp);

describe('<PaymentBarCheckoutButton />', () => {
  const renderWithCartContext = ui => render(
    <CartContext.Provider
      value={{
        isLoading: false,
      }}
    >
      {ui}
    </CartContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render disabled button', () => {
    const { getByRole } = renderWithCartContext(<PaymentBarCheckoutButton isOrderable={false} />);

    expect(getByRole('button')).toBeDisabled();
    expect(mockText).toHaveBeenCalledWith(expect.objectContaining({ string: 'cart.checkout' }));
  });

  it('should render enabled button', () => {
    const { getByRole } = renderWithCartContext(<PaymentBarCheckoutButton isOrderable />);

    expect(getByRole('button')).not.toBeDisabled();
  });

  // The button navigates through the router itself now, rather than being wrapped in a Link.
  it('should link to the checkout', () => {
    const { getByRole } = renderWithCartContext(<PaymentBarCheckoutButton isOrderable />);

    expect(getByRole('button')).toHaveAttribute('data-href', '/checkout');
  });

  it('should render the button in the merchant configurable cta color', () => {
    const { getByRole } = renderWithCartContext(<PaymentBarCheckoutButton isOrderable />);

    expect(getByRole('button')).toHaveAttribute('data-color', 'cta');
  });

  it('should show the grand total when asked to', () => {
    const { getByTestId } = render(
      <CartContext.Provider value={{
        isLoading: false,
        currency: 'EUR',
        config: {},
      }}
      >
        <PaymentBarCheckoutButton isOrderable grandTotal={89.9} showTotal />
      </CartContext.Provider>
    );

    expect(getByTestId('price')).toHaveTextContent('89.9 EUR');
  });

  it('should leave the grand total out when the cart hides totals', () => {
    const { queryByTestId } = render(
      <CartContext.Provider value={{
        isLoading: false,
        currency: 'EUR',
        config: { hideTotal: true },
      }}
      >
        <PaymentBarCheckoutButton isOrderable grandTotal={89.9} showTotal />
      </CartContext.Provider>
    );

    expect(queryByTestId('price')).not.toBeInTheDocument();
  });
});
