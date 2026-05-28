import React from 'react';
import { render } from '@shopgate/pwa-unit-test/rtlUtils';
import PaymentBarCheckoutButton from '../PaymentBarCheckoutButton';
import { CartContext } from '../../../cart.context';

function mockFactories() {
  return jest.requireActual('../testUtils/mockFactories');
}

const mockLink = jest.fn(props => <div data-testid="link">{props.children}</div>);
const mockText = jest.fn(() => <div data-testid="text" />);

jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: mockFactories().createSurroundPortalsMock(),
  Link: props => mockLink(props),
  I18n: {
    Text: props => mockText(props),
  },
}));

jest.mock('@shopgate/pwa-ui-shared/RippleButton', () => mockFactories().createRippleButtonMock());

jest.mock('@shopgate/engage/styles', () => mockFactories().createStylesMock());

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
    const { container } = renderWithCartContext(<PaymentBarCheckoutButton isOrderable={false} />);

    expect(container.firstChild).toBeTruthy();
    expect(mockLink).toHaveBeenCalledWith(expect.objectContaining({ disabled: true }));
    expect(mockText).toHaveBeenCalledWith(expect.objectContaining({ string: 'cart.checkout' }));
  });

  it('should render enabled button', () => {
    const { container } = renderWithCartContext(<PaymentBarCheckoutButton isOrderable />);

    expect(container.firstChild).toBeTruthy();
    expect(mockLink).toHaveBeenCalledWith(expect.objectContaining({ disabled: false }));
  });
});
