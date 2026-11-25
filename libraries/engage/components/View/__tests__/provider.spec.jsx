import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { combineReducers } from 'redux';
import { Provider as StoreProvider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { increaseModalCount, decreaseModalCount } from '@shopgate/engage/a11y/action-creators';
import a11y from '@shopgate/engage/a11y/reducers';
import { emitScrollEvents, stopScrollEvents } from '@shopgate/engage/core/streams';
import Provider from '../provider';

jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/core/streams', () => ({
  emitScrollEvents: jest.fn(),
  stopScrollEvents: jest.fn(),
}));

const mockContextProvider = jest.fn(({ children }) => children);

jest.mock('../context', () => ({
  ViewContext: {
    Provider: props => mockContextProvider(props),
  },
}));

describe('engage > components > view > provider', () => {
  let store;
  let dispatch;

  beforeEach(() => {
    jest.clearAllMocks();

    store = createMockStore(combineReducers({
      a11y,
    }));
    ({ dispatch } = store);
  });

  const getLastProviderValue = () => {
    const lastCall = mockContextProvider.mock.calls[mockContextProvider.mock.calls.length - 1];
    return lastCall[0].value;
  };

  it('should initialize provider context', () => {
    render((
      <StoreProvider store={store}>
        <Provider>
          <div>Page #1</div>
        </Provider>
      </StoreProvider>
    ));

    expect(screen.getByText('Page #1')).toBeTruthy();
    expect(getLastProviderValue().ariaHidden).toBe(false);
  });

  it('should toggle aria-hidden context value when modalCount redux state changes', () => {
    render((
      <StoreProvider store={store}>
        <Provider>
          <div>Page #1</div>
        </Provider>
      </StoreProvider>
    ));

    expect(screen.getByText('Page #1')).toBeTruthy();

    // Check initial aria hidden state
    expect(getLastProviderValue().ariaHidden).toBe(false);

    // Update a11y state
    act(() => {
      dispatch(increaseModalCount());
    });
    // Check updated aria hidden state
    expect(getLastProviderValue().ariaHidden).toBe(true);

    // Update a11y state
    act(() => {
      dispatch(decreaseModalCount());
    });
    // Check updated aria hidden state
    expect(getLastProviderValue().ariaHidden).toBe(false);
  });

  describe('scroll events', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    const renderProvider = () => render((
      <StoreProvider store={store}>
        <Provider>
          <div>Page #1</div>
        </Provider>
      </StoreProvider>
    ));

    it('should stop the scroll events of the content when it unmounts', () => {
      const { unmount } = renderProvider();
      const element = document.createElement('div');

      act(() => {
        getLastProviderValue().setContentRef({ current: element });
        jest.advanceTimersByTime(250);
      });
      expect(emitScrollEvents).toHaveBeenCalledWith(element);

      unmount();
      expect(stopScrollEvents).toHaveBeenLastCalledWith(element);
    });

    it('should not set up scroll events when it unmounts before the delay', () => {
      const { unmount } = renderProvider();

      act(() => {
        getLastProviderValue().setContentRef({ current: document.createElement('div') });
      });
      unmount();
      jest.advanceTimersByTime(250);

      expect(emitScrollEvents).not.toHaveBeenCalled();
    });
  });
});
