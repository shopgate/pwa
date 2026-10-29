import { render, screen } from '@testing-library/react';
import PaymentBar from '../PaymentBar';

/* eslint-disable react/prop-types */
jest.mock('@shopgate/engage/components', () => ({
  FooterBar: ({ variant, children }) => <div data-testid="footer-bar" data-variant={variant}>{children}</div>,
}));
jest.mock('../PaymentBarContent', () => ({ embedded, checkoutOnly }) => (
  <div
    data-testid="content"
    data-embedded={String(embedded)}
    data-checkout-only={String(checkoutOnly)}
  />
));

/* eslint-enable react/prop-types */

describe('<PaymentBar />', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="AppFooter"></div>';
  });

  it('renders as before without a variant', () => {
    render(<PaymentBar />);

    expect(screen.queryByTestId('footer-bar')).not.toBeInTheDocument();
    expect(screen.getByTestId('content')).not.toHaveAttribute('data-embedded', 'true');
  });

  it('renders the whole bar on top of the tab bar for the fixed variant', () => {
    render(<PaymentBar variant="fixed" />);

    expect(screen.getByTestId('footer-bar')).toHaveAttribute('data-variant', 'fixed');
    expect(screen.getByTestId('content')).toHaveAttribute('data-embedded', 'true');
    expect(screen.getByTestId('content')).toHaveAttribute('data-checkout-only', 'false');
  });

  it('renders only the checkout button for the floating variant', () => {
    render(<PaymentBar variant="floating" />);

    expect(screen.getByTestId('footer-bar')).toHaveAttribute('data-variant', 'floating');
    expect(screen.getByTestId('content')).toHaveAttribute('data-checkout-only', 'true');
  });

  it('renders nothing while hidden', () => {
    render(<PaymentBar variant="fixed" visible={false} />);

    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });
});
