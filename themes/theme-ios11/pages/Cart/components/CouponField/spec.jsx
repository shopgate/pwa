import { render } from '@testing-library/react';
import Layout from './components/Layout';
import { UnwrappedCouponField as CouponField } from './index';

jest.mock('@shopgate/engage/cart', () => ({
  CART_INPUT_AUTO_SCROLL_DELAY: 'CART_INPUT_AUTO_SCROLL_DELAY',
}));
jest.mock('./components/Layout', () => jest.fn(() => null));

const defaultLayoutProps = {
  error: '',
  iconStyle: { opacity: 0 },
  isButtonDisabled: true,
  isLoading: false,
  value: '',
};

describe('<CouponField />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render as expected without any props', () => {
    render(<CouponField visible />);

    expect(Layout.mock.lastCall[0]).toEqual(expect.objectContaining(defaultLayoutProps));
  });

  it('should not render when the cart does not support coupons', () => {
    const { container } = render(<CouponField visible isSupported={false} />);

    expect(container).toBeEmptyDOMElement();
    expect(Layout).not.toHaveBeenCalled();
  });
});
