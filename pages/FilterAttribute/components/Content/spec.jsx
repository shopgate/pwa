import React from 'react';
import { Provider } from 'react-redux';
import { MockedView } from 'Components/View/mock';
import { mount } from 'enzyme';
import {
  getEmptyStore,
  getStoreWithActiveSingleSelection,
  getStoreWithActiveMultiSelection,
} from './mock';

const mockedView = MockedView;
jest.mock('Components/View', () => mockedView);

describe('FilterAttribute', () => {
  /**
   * Creates component
   * @param {Object} store Store.
   * @returns {Object}
   */
  const createComponent = (store) => {
    // eslint-disable-next-line global-require
    const FilterAttribute = require('./index').default;

    return mount((
      <Provider store={store}>
        <FilterAttribute />
      </Provider>
    ));
  };

  it('should render nothing', () => {
    const wrapper = createComponent(getEmptyStore());
    expect(wrapper.find('SingleSelect').exists()).toBe(false);
    expect(wrapper.find('MultiSelect').exists()).toBe(false);
  });

  it('should render SingleSelect', () => {
    const wrapper = createComponent(getStoreWithActiveSingleSelection());
    expect(wrapper.find('SingleSelect').exists()).toBe(true);
    expect(wrapper.find('MultiSelect').exists()).toBe(false);
  });
  it('should render MultiSelect', () => {
    const wrapper = createComponent(getStoreWithActiveMultiSelection());
    expect(wrapper.find('SingleSelect').exists()).toBe(false);
    expect(wrapper.find('MultiSelect').exists()).toBe(true);
  });
});
