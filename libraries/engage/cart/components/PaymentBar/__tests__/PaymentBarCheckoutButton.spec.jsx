import React from 'react';
import { render } from '@testing-library/react';
import { getOrderableStatus } from '@shopgate/pwa-common-commerce/cart/selectors';
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

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: selector => selector(),
}));
jest.mock('@shopgate/pwa-common-commerce/cart/selectors', () => ({
  getOrderableStatus: jest.fn(),
  getGrandTotal: () => 89.9,
}));

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
    getOrderableStatus.mockReturnValue(true);
  });

  it('should render disabled button', () => {
    getOrderableStatus.mockReturnValue(false);
    const { getByRole } = renderWithCartContext(<PaymentBarCheckoutButton />);

    expect(getByRole('button')).toBeDisabled();
    expect(mockText).toHaveBeenCalledWith(expect.objectContaining({ string: 'cart.checkout' }));
  });

  it('should render enabled button', () => {
    const { getByRole } = renderWithCartContext(<PaymentBarCheckoutButton />);

    expect(getByRole('button')).not.toBeDisabled();
  });

  // The button navigates through the router itself now, rather than being wrapped in a Link.
  it('should link to the checkout', () => {
    const { getByRole } = renderWithCartContext(<PaymentBarCheckoutButton />);

    expect(getByRole('button')).toHaveAttribute('data-href', '/checkout');
  });

  it('should render the button in the merchant configurable cta color', () => {
    const { getByRole } = renderWithCartContext(<PaymentBarCheckoutButton />);

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
        <PaymentBarCheckoutButton showTotal />
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
        <PaymentBarCheckoutButton showTotal />
      </CartContext.Provider>
    );

    expect(queryByTestId('price')).not.toBeInTheDocument();
  });
});
