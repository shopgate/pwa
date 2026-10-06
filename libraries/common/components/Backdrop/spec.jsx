import { render, fireEvent } from '@testing-library/react';
import Backdrop from './index';

describe('<Backdrop />', () => {
  let mockOpen;

  beforeEach(() => {
    mockOpen = jest.fn();
  });

  it('should render', () => {
    const { container } = render(<Backdrop isVisible />);
    const backdrop = container.querySelector('[data-test-id="Backdrop"]');

    expect(backdrop).toBeInTheDocument();
    expect(backdrop).toHaveClass('common__backdrop');
    expect(backdrop).toHaveAttribute('aria-hidden', 'true');
    expect(backdrop).toHaveStyle({ transition: 'opacity 200ms ease-out' });
  });

  it('should execute callback when Backdrop is clicked', () => {
    const { container } = render(<Backdrop isVisible onClick={mockOpen} />);
    fireEvent.click(container.querySelector('[data-test-id="Backdrop"]'));
    expect(mockOpen).toBeCalled();
  });
});
