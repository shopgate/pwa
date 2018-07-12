import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { defaultState } from './../../../../mock';

const mockedStore = configureStore([thunk]);
let store;

jest.mock('./../../../../context');
const { defaultContext } = require('./../../../../context');

// eslint-disable-next-line require-jsdoc
const createComponent = (state = defaultState) => {
  // eslint-disable-next-line global-require
  const Search = require('./index').default;
  store = mockedStore(state);
  return mount(<Search store={store} />, mockRenderOptions);
};

describe('Search', () => {
  afterEach(() => {
    jest.resetAllMocks();
    store.clearActions();
  });

  it('should render', () => {
    defaultContext.searchField = true;
    const wrapper = createComponent();
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle input', () => {
    const value = 'Search query';
    defaultContext.searchField = true;
    const wrapper = createComponent();
    wrapper.find('input').simulate('change', { preventDefault: () => {}, target: { value } });

    expect(defaultContext.setSearchQuery.mock.calls.length).toEqual(1);
    expect(defaultContext.setSearchQuery.mock.calls[0]).toEqual([value]);
  });

  it('should handle focus', () => {
    defaultContext.searchField = true;
    defaultContext.searchQuery = 'Search query';

    const wrapper = createComponent();
    const { selectionEnd } = wrapper.find('NavigatorSearch').instance().inputField.current;
    expect(selectionEnd).toEqual(0);

    wrapper.find('input').simulate('focus');
    const selectionEndAfterFocus = wrapper.find('NavigatorSearch').instance().inputField.current.selectionEnd;
    expect(selectionEndAfterFocus).toEqual(defaultContext.searchQuery.length);
  });

  it('should handle submit', () => {
    defaultContext.searchField = true;
    const wrapper = createComponent();

    wrapper.find('form').simulate('submit', { preventDefault: () => {} });
    expect(defaultContext.toggleSearchField.mock.calls.length).toEqual(1);
    expect(defaultContext.toggleSearchField.mock.calls[0]).toEqual([false, true]);
  });
});
