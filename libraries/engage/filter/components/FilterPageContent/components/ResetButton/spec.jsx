import { render, screen, fireEvent } from '@testing-library/react';
import { SurroundPortals } from '@shopgate/engage/components';
import ResetButton from './index';

const clickMock = jest.fn();

jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: jest.fn(({ children }) => children),
  I18n: {
    Text: ({ string }) => string,
  },
}));

describe('Filter: <ResetButton />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render as activated', () => {
    const onClick = () => {};
    render(<ResetButton onClick={onClick} />);

    const button = screen.getByRole('button', { name: 'filter.clear_all' });

    expect(button).toBeEnabled();
    expect(button).toHaveAttribute('data-variant', 'outlined');
    expect(button).toHaveAttribute('data-size', 'small');
    expect(button).toHaveAttribute('data-full-width', 'true');
    expect(button).toHaveAttribute('data-test-id', 'clearAllButton');
    expect(SurroundPortals.mock.lastCall[0]).toEqual(expect.objectContaining({
      portalName: 'filter.reset-button',
      portalProps: {
        disabled: false,
        onClick,
      },
    }));
  });

  it('should render as deactivated', () => {
    const onClick = () => {};
    render(<ResetButton disabled onClick={onClick} />);

    expect(screen.getByRole('button', { name: 'filter.clear_all' })).toBeDisabled();
    expect(SurroundPortals.mock.lastCall[0]).toEqual(expect.objectContaining({
      portalName: 'filter.reset-button',
      portalProps: {
        disabled: true,
        onClick,
      },
    }));
  });

  it('should handle clicks', () => {
    render(<ResetButton onClick={clickMock} />);

    fireEvent.click(screen.getByRole('button', { name: 'filter.clear_all' }));

    expect(clickMock).toHaveBeenCalledTimes(1);
  });
});
