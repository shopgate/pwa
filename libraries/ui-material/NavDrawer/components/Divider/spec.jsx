import { render, screen } from '@testing-library/react';
import Divider from './index';

describe('<NavDrawerDivider />', () => {
  it('should render a separator which is hidden from assistive technology', () => {
    render(<Divider />);

    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
    expect(screen.getByRole('separator', { hidden: true })).toHaveAttribute('aria-hidden', 'true');
  });
});
