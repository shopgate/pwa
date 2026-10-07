import { render, screen, fireEvent } from '@testing-library/react';
import { Disconnected as Link } from './index';

describe('<Link />', () => {
  const historyPush = jest.fn();
  const historyReplace = jest.fn();
  const pathname = '/';
  const state = { x: 5 };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders with children', () => {
    render((
      <Link
        href={pathname}
        historyPush={historyPush}
        historyReplace={historyReplace}
      >
        <span />
      </Link>
    ));

    const link = screen.getByRole('link');

    expect(link.tagName).toBe('DIV');
    expect(link).toHaveClass('common__link');
    expect(link).toHaveAttribute('data-test-id', 'link: /');
    expect(link).not.toHaveAttribute('href');
    expect(link).not.toHaveAttribute('tabindex');
    expect(link).not.toHaveAttribute('aria-label');
    expect(link).not.toHaveAttribute('aria-hidden');
    expect(link.innerHTML).toBe('<span></span>');
  });

  it('handles a push', () => {
    render((
      <Link
        href={pathname}
        state={state}
        historyPush={historyPush}
        historyReplace={historyReplace}
      >
        <span />
      </Link>
    ));

    fireEvent.click(screen.getByRole('link'));
    jest.runAllTimers();
    expect(historyPush).toHaveBeenLastCalledWith({
      pathname,
      state,
    });
    expect(historyReplace).not.toHaveBeenCalled();
  });

  it('handles a replace', () => {
    render((
      <Link
        href={pathname}
        historyPush={historyPush}
        historyReplace={historyReplace}
        state={state}
        replace
      >
        <span />
      </Link>
    ));

    fireEvent.click(screen.getByRole('link'));
    jest.runAllTimers();
    expect(historyReplace).toHaveBeenLastCalledWith({
      pathname,
      state,
    });
    expect(historyPush).not.toHaveBeenCalled();
  });
});
