import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen } from '@testing-library/react';
import appConfig from '@shopgate/pwa-common/helpers/config';
import event from '@shopgate/pwa-core/classes/Event';
import {
  APP_EVENT_VIEW_WILL_APPEAR,
  APP_EVENT_VIEW_WILL_DISAPPEAR,
} from '@shopgate/pwa-core/constants/AppEvents';
import AppProvider from '../AppProvider';
import AppContext from '../../contexts/AppContext';

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  some: 'prop',
}));

jest.mock('@shopgate/pwa-core/classes/Event', () => ({
  addCallback: jest.fn(),
  removeCallback: jest.fn(),
}));

let latestContext;

const MockComponent = () => (
  <AppContext.Consumer>
    {(value) => {
      latestContext = value;

      return (
        <pre data-testid="app-context">
          {JSON.stringify({
            appConfig: value.appConfig,
            isVisible: value.isVisible,
            hasSetIsVisible: typeof value.setIsVisible === 'function',
          })}
        </pre>
      );
    }}
  </AppContext.Consumer>
);

describe('engage > core > providers > AppProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    latestContext = null;
  });

  it('should initialize as expected', () => {
    render((
      <AppProvider>
        <MockComponent />
      </AppProvider>
    ));

    expect(screen.getByTestId('app-context')).toMatchSnapshot();
    expect(latestContext).toEqual({
      appConfig,
      isVisible: true,
      setIsVisible: expect.any(Function),
    });
    expect(event.addCallback).toHaveBeenCalledTimes(2);
    expect(event.addCallback).toHaveBeenCalledWith(
      APP_EVENT_VIEW_WILL_APPEAR,
      expect.any(Function)
    );
    expect(event.addCallback).toHaveBeenCalledWith(
      APP_EVENT_VIEW_WILL_DISAPPEAR,
      expect.any(Function)
    );
  });

  it('should handle calls of setIsVisible() as expected', () => {
    const appProviderRef = React.createRef();

    render((
      <AppProvider ref={appProviderRef}>
        <MockComponent />
      </AppProvider>
    ));

    expect(latestContext.isVisible).toBe(true);

    act(() => {
      appProviderRef.current.setIsVisible(false);
    });
    expect(latestContext.isVisible).toBe(false);

    act(() => {
      appProviderRef.current.setIsVisible(true);
    });
    expect(latestContext.isVisible).toBe(true);
  });

  it('should handle event calls as expected', () => {
    render((
      <AppProvider>
        <MockComponent />
      </AppProvider>
    ));

    const [[, setVisible], [, setHidden]] = event.addCallback.mock.calls;
    expect(latestContext.isVisible).toBe(true);

    act(() => {
      setHidden();
    });
    expect(latestContext.isVisible).toBe(false);

    act(() => {
      setVisible();
    });
    expect(latestContext.isVisible).toBe(true);
  });

  it('should remove the event listeners on unmount', () => {
    const { unmount } = render((
      <AppProvider>
        <MockComponent />
      </AppProvider>
    ));

    const [[, setVisible], [, setHidden]] = event.addCallback.mock.calls;
    unmount();

    expect(event.removeCallback).toHaveBeenCalledTimes(2);
    expect(event.removeCallback).toHaveBeenCalledWith(
      APP_EVENT_VIEW_WILL_APPEAR,
      setVisible
    );
    expect(event.removeCallback).toHaveBeenCalledWith(
      APP_EVENT_VIEW_WILL_DISAPPEAR,
      setHidden
    );
  });
});
