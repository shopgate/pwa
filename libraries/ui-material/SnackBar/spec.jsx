import React from 'react';
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
  const { useEffect } = require('react');
  return {
    Spring: ({ children, onRest }) => {
      useEffect(() => {
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
});
