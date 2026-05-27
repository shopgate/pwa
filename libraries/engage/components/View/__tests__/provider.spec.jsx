import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen } from '@shopgate/pwa-unit-test/rtlUtils';
import { combineReducers } from 'redux';
import { Provider as StoreProvider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { increaseModalCount, decreaseModalCount } from '@shopgate/engage/a11y/action-creators';
import a11y from '@shopgate/engage/a11y/reducers';
import Provider from '../provider';

jest.mock('@shopgate/engage/components');

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
});
