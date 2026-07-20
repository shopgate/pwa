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

// Render the Spring render-prop child immediately without animating.
jest.mock('react-spring', () => ({ config: { stiff: {} } }));
jest.mock('react-spring/renderprops.cjs', () => ({
  Spring: ({ children }) => children({}),
}));

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
      jest.advanceTimersByTime(500);
    });
    fireEvent.mouseUp(message);

    expect(onLongPress).toHaveBeenCalledTimes(1);
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
