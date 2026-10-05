import { render, screen } from '@testing-library/react';
import CouponsHint from './index';

describe('<CouponsHint />', () => {
  it('should render as expected without any props', () => {
    render(<CouponsHint />);

    expect(screen.getByText('cart.coupons_not_supported')).toBeInTheDocument();
  });
});
