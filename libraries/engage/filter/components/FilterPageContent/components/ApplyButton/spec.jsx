import { render, screen, fireEvent } from '@testing-library/react';
import { SurroundPortals } from '@shopgate/engage/components';
import ApplyButton from './index';

const clickMock = jest.fn();

jest.mock('@shopgate/engage/core', () => ({
  withWidgetSettings: function withWidgetSettings(Comp) {
    return props => (<Comp widgetSettings={{}} {...props} />);
  },
}));
jest.mock('@shopgate/engage/components', () => ({
  SurroundPortals: jest.fn(({ children }) => children),
  I18n: {
    Text: ({ string }) => string,
  },
}));

describe('Filter: <ApplyButton />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render as activated', () => {
    const onClick = () => { };
    render(<ApplyButton onClick={onClick} />);

    const button = screen.getByRole('button', { name: 'filter.view_results' });

    expect(button).toBeEnabled();
    expect(button).toHaveAttribute('data-variant', 'contained');
    expect(button).toHaveAttribute('data-color', 'primary');
    expect(button).toHaveAttribute('data-size', 'small');
    expect(button).toHaveAttribute('data-full-width', 'true');
    expect(button).toHaveAttribute('data-test-id', 'applyFilterButton');
    expect(SurroundPortals.mock.lastCall[0]).toEqual(expect.objectContaining({
      portalName: 'filter.apply-button',
      portalProps: {
        disabled: false,
        onClick,
        widgetSettings: {},
      },
    }));
  });

  it('should render as deactivated', () => {
    const onClick = () => { };
    render(<ApplyButton disabled onClick={onClick} />);

    expect(screen.getByRole('button', { name: 'filter.view_results' })).toBeDisabled();
    expect(SurroundPortals.mock.lastCall[0]).toEqual(expect.objectContaining({
      portalName: 'filter.apply-button',
      portalProps: {
        disabled: true,
        onClick,
        widgetSettings: {},
      },
    }));
  });

  it('should handle clicks', () => {
    render(<ApplyButton onClick={clickMock} />);

    fireEvent.click(screen.getByRole('button', { name: 'filter.view_results' }));

    expect(clickMock).toHaveBeenCalledTimes(1);
  });
});
