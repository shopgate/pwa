import { render, screen, fireEvent } from '@testing-library/react';
import ToggleIcon from './index';

const inputProps = {
  onIcon: <span>on-icon</span>,
  offIcon: <span>off-icon</span>,
};

describe('<ToggleIcon>', () => {
  it('should render a toggle icon', () => {
    const { container } = render(<ToggleIcon {...inputProps} />);

    expect(container.querySelector('.ui-shared__toggle-icon')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('on-icon')).toBeInTheDocument();
    expect(screen.queryByText('off-icon')).not.toBeInTheDocument();
  });

  it('should render a toggle icon with false as default', () => {
    render(<ToggleIcon {...inputProps} on={false} />);

    expect(screen.queryByText('on-icon')).not.toBeInTheDocument();
    expect(screen.getByText('off-icon')).toBeInTheDocument();
  });

  it('should trigger the toggleHandler callback', () => {
    const mockToggleHandler = jest.fn();

    const { container } = render(<ToggleIcon {...inputProps} toggleHandler={mockToggleHandler} />);

    fireEvent.click(container.querySelector('.ui-shared__toggle-icon'));

    expect(mockToggleHandler).toHaveBeenCalledTimes(1);
    expect(mockToggleHandler).toHaveBeenCalledWith(false);
    expect(screen.queryByText('on-icon')).not.toBeInTheDocument();
    expect(screen.getByText('off-icon')).toBeInTheDocument();
  });
});
