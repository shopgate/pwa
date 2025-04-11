import React from 'react';
import { mount } from 'enzyme';
import { combineReducers } from 'redux';
import { Provider as StoreProvider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { increaseModalCount, decreaseModalCount } from '@shopgate/engage/a11y/action-creators';
import a11y from '@shopgate/engage/a11y/reducers';
import Provider from '../provider';

jest.mock('@shopgate/engage/components');
jest.mock('../context');

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

  it('should initialize and provider context', () => {
    const wrapper = mount((
      <StoreProvider store={store}>
        <Provider>
          <div>Page #1</div>
        </Provider>
      </StoreProvider>
    ));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Provider').last().prop('value').ariaHidden).toBe(false);
  });

  it('should toggle aria-hidden context value when modalCount redux state changes', () => {
    const wrapper = mount((
      <StoreProvider store={store}>
        <Provider>
          <div>Page #1</div>
        </Provider>
      </StoreProvider>
    ));
    expect(wrapper).toMatchSnapshot();

    // Check initial aria hidden state
    expect(wrapper.find('Provider').last().prop('value').ariaHidden).toBe(false);

    // Update a11y state
    dispatch(increaseModalCount());
    wrapper.update();
    // Check updated aria hidden state
    expect(wrapper.find('Provider').last().prop('value').ariaHidden).toBe(true);

    // Update a11y state
    dispatch(decreaseModalCount());
    wrapper.update();
    // Check updated aria hidden state
    expect(wrapper.find('Provider').last().prop('value').ariaHidden).toBe(false);
  });
});
