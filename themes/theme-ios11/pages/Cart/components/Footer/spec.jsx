import { render, screen } from '@testing-library/react';
import Footer from './index';

jest.mock('./connector', () => obj => obj);
jest.mock('@shopgate/engage/cart', () => ({
  FLAG_MULTI_LINE_RESERVE: 'FLAG_MULTI_LINE_RESERVE',
  CartContext: jest.requireActual('react').createContext({ flags: {} }),
  SupplementalContent: () => <div>SupplementalContent</div>,
}));
jest.mock('@shopgate/pwa-ui-shared/TaxDisclaimer', () => () => <div>TaxDisclaimer</div>);
jest.mock('./components/CouponsHint', () => () => <div>CouponsHint</div>);

describe('<Footer />', () => {
  it('should render as expected when all items are supposed to be shown', () => {
    render(<Footer showCouponsHint showTaxDisclaimer />);

    expect(screen.getByText('CouponsHint')).toBeInTheDocument();
    expect(screen.getByText('TaxDisclaimer')).toBeInTheDocument();
    expect(screen.queryByText('SupplementalContent')).not.toBeInTheDocument();
  });

  it('should render as expected when no items are supposed to be shown', () => {
    const { container } = render(<Footer showCouponsHint={false} showTaxDisclaimer={false} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should render as expected when only the the coupons hint is supposed to be shown', () => {
    render(<Footer showCouponsHint showTaxDisclaimer={false} />);

    expect(screen.getByText('CouponsHint')).toBeInTheDocument();
    expect(screen.queryByText('TaxDisclaimer')).not.toBeInTheDocument();
    expect(screen.queryByText('SupplementalContent')).not.toBeInTheDocument();
  });

  it('should render as expected when only the tax disclaimer is supposed to be shown', () => {
    render(<Footer showCouponsHint={false} showTaxDisclaimer />);

    expect(screen.getByText('TaxDisclaimer')).toBeInTheDocument();
    expect(screen.queryByText('CouponsHint')).not.toBeInTheDocument();
    expect(screen.queryByText('SupplementalContent')).not.toBeInTheDocument();
  });
});
