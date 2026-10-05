import { render, screen } from '@testing-library/react';
import Header from './index';

describe('<Header />', () => {
  it('should render with correct title', () => {
    const title = 'My Title';
    render(<Header title={title} />);

    const heading = screen.getByRole('heading', { name: title });

    expect(heading).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('button', { name: 'common.close' })).toBeInTheDocument();
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });
});
