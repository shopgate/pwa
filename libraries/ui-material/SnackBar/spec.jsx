import React, { useState, useCallback, useEffect } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import SnackBar from './index';

// Use the real long-press hook (the barrel would otherwise drag in appEvents/pwa-core).
jest.mock('@shopgate/engage/core/hooks/events', () => ({
  __esModule: true,
  useLongPress: jest.requireActual('@shopgate/engage/core/hooks/events/useLongPress').default,
}));

jest.mock('@shopgate/engage/core/helpers', () => ({
  i18n: { text: input => input || '' },
}));

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  themeColors: {
    light: '#ffffff',
    lightDark: '#333333',
    accent: '#00aaff',
  },
  themeShadows: { toast: 'none' },
}));

jest.mock('@shopgate/pwa-common/components/Ellipsis', () => ({
  __esModule: true,
  default: ({ children }) => children,
}));

jest.mock('@shopgate/engage/styles', () => ({
  makeStyles: () => () => () => ({
    classes: new Proxy({}, { get: (_, prop) => prop }),
    cx: (...args) => args.filter(Boolean).join(' '),
  }),
}));

// Render the Spring render-prop child immediately without animating. onRest is fired on a 0ms
// timer to mirror react-spring calling it after the commit — this drives the auto-hide countdown.
jest.mock('react-spring', () => ({ config: { stiff: {} } }));
jest.mock('react-spring/renderprops.cjs', () => {
  // eslint-disable-next-line global-require
  const { useEffect: useSpringEffect } = require('react');
  return {
    Spring: ({ children, onRest }) => {
      useSpringEffect(() => {
        const id = setTimeout(() => onRest && onRest(), 0);
        return () => clearTimeout(id);
      });
      return children({});
    },
  };
});

describe('<SnackBar />', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should invoke onLongPress after a long press on a toast that provides one', () => {
    const onLongPress = jest.fn();
    const toasts = [{
      id: 'pipeline.error',
      message: 'error.general',
      onLongPress,
      duration: 5000,
    }];

    render(<SnackBar removeToast={jest.fn()} toasts={toasts} />);

    const message = screen.getByText('error.general');
    fireEvent.mouseDown(message);
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    fireEvent.mouseUp(message);

    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('should keep the toast open while it is being long-pressed instead of auto-hiding', () => {
    const onLongPress = jest.fn();
    const removeToast = jest.fn();
    const toasts = [{
      id: 'pipeline.error',
      message: 'error.general',
      onLongPress,
      duration: 2500,
    }];

    render(<SnackBar removeToast={removeToast} toasts={toasts} />);

    const message = screen.getByText('error.general');
    fireEvent.mouseDown(message);

    // Hold well past the toast's 2500ms lifetime: the auto-hide countdown must be frozen, so the
    // toast neither hides nor gets removed while the press is ongoing.
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(onLongPress).not.toHaveBeenCalled();
    expect(removeToast).not.toHaveBeenCalled();

    // The long press still completes at its 4000ms threshold.
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('should invoke the pressed toast\'s handler even if the toast is mutated in place mid-press', () => {
    // ToastProvider updates a same-id toast by mutating it in place, so the long-press must fire
    // the handler captured when the press started, not whatever toasts[0].onLongPress became.
    const pressedHandler = jest.fn();
    const replacementHandler = jest.fn();
    const toasts = [{
      id: 'pipeline.error',
      message: 'error.general',
      onLongPress: pressedHandler,
      duration: 5000,
    }];

    render(<SnackBar removeToast={jest.fn()} toasts={toasts} />);

    const message = screen.getByText('error.general');
    fireEvent.mouseDown(message);
    // A second pipeline error arrives during the press and overwrites the toast's handler in place.
    toasts[0].onLongPress = replacementHandler;
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    fireEvent.mouseUp(message);

    expect(pressedHandler).toHaveBeenCalledTimes(1);
    expect(replacementHandler).not.toHaveBeenCalled();
  });

  it('should not also fire the box click action on a long press when onLongPress is present', () => {
    const onLongPress = jest.fn();
    const action = jest.fn();
    const toasts = [{
      id: 'pipeline.error',
      message: 'error.general',
      onLongPress,
      action, // no actionLabel → would otherwise become a whole-box onClick
      duration: 5000,
    }];

    render(<SnackBar removeToast={jest.fn()} toasts={toasts} />);

    const message = screen.getByText('error.general');
    fireEvent.mouseDown(message);
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    fireEvent.mouseUp(message);
    // The pointer release also produces a click, which must not run the action too.
    fireEvent.click(message);

    expect(onLongPress).toHaveBeenCalledTimes(1);
    expect(action).not.toHaveBeenCalled();
  });

  it('should not invoke onLongPress when the press is released before the threshold', () => {
    const onLongPress = jest.fn();
    const toasts = [{
      id: 'pipeline.error',
      message: 'error.general',
      onLongPress,
      duration: 5000,
    }];

    render(<SnackBar removeToast={jest.fn()} toasts={toasts} />);

    const message = screen.getByText('error.general');
    fireEvent.mouseDown(message);
    act(() => {
      jest.advanceTimersByTime(300);
    });
    fireEvent.mouseUp(message);
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('should not attach long-press handlers when the toast has no onLongPress', () => {
    const toasts = [{
      id: 'pipeline.error',
      message: 'error.general',
      duration: 5000,
    }];

    render(<SnackBar removeToast={jest.fn()} toasts={toasts} />);

    // A long press must be a no-op (and must not throw) when no handler is provided.
    const message = screen.getByText('error.general');
    fireEvent.mouseDown(message);
    expect(() => act(() => {
      jest.advanceTimersByTime(500);
    })).not.toThrow();
  });

  it('should play each queued toast in turn — the second is not skipped or instantly removed', () => {
    // Mirrors ToastProvider: a FIFO queue whose head is dropped (immutably) on removeToast.
    const Harness = () => {
      const [toasts, setToasts] = useState([
        {
          id: 'a',
          message: 'first.toast',
          duration: 2500,
        },
        {
          id: 'b',
          message: 'second.toast',
          duration: 2500,
        },
      ]);
      const removeToast = useCallback(() => setToasts(t => t.slice(1)), []);
      if (!toasts.length) return null;
      return <SnackBar removeToast={removeToast} toasts={toasts} />;
    };

    render(<Harness />);

    // First toast is shown; the second is still queued, not yet rendered.
    expect(screen.getByText('first.toast')).toBeTruthy();
    expect(screen.queryByText('second.toast')).toBe(null);

    // First toast dwells (2500ms), then slides out and is removed after the exit animation.
    act(() => { jest.advanceTimersByTime(2500 + 600); });

    // The second toast is now on screen — it got its turn rather than being dropped instantly.
    expect(screen.getByText('second.toast')).toBeTruthy();
    expect(screen.queryByText('first.toast')).toBe(null);

    // It in turn dwells and is removed, draining the queue.
    act(() => { jest.advanceTimersByTime(2500 + 600); });
    expect(screen.queryByText('second.toast')).toBe(null);
  });

  it('auto-hides within its duration even when the parent re-renders repeatedly', () => {
    // The spring re-settles (and fires onRest) on every render because of `force`. The auto-hide
    // countdown must therefore NOT be tied to onRest, or frequent parent re-renders would keep
    // resetting it and the toast would outlive its duration.
    const removeToast = jest.fn();
    const Harness = () => {
      const [, tick] = useState(0);
      useEffect(() => {
        const id = setInterval(() => tick(n => n + 1), 500); // re-render every 500ms (< duration)
        return () => clearInterval(id);
      }, []);
      const toasts = [{
        id: 'a',
        message: 'error.general',
        duration: 2500,
      }];
      return <SnackBar removeToast={removeToast} toasts={toasts} />;
    };

    render(<Harness />);

    // Not yet gone before its duration elapses.
    act(() => { jest.advanceTimersByTime(2000); });
    expect(removeToast).not.toHaveBeenCalled();

    // Removed shortly after its duration (dwell + exit animation), despite the periodic re-renders.
    act(() => { jest.advanceTimersByTime(500 + 600); });
    expect(removeToast).toHaveBeenCalledTimes(1);
  });
});
