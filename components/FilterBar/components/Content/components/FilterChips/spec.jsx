import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import {
  getDefaultStore,
  getStoreWithSelectedFilters,
} from '../../../../mock';
import FilterChips from './index';

const mockedRemoveTemporaryFilter = jest.fn();
jest.mock(
  '@shopgate/pwa-common-commerce/filter/action-creators/removeTemporaryFilter',
  () => (...args) => {
    mockedRemoveTemporaryFilter(...args);

    return { type: 'remove' };
  }
);

const mockedCommitTemporaryFilters = jest.fn();
jest.mock(
  '@shopgate/pwa-common-commerce/filter/actions/commitTemporaryFilters',
  () => (...args) => {
    mockedCommitTemporaryFilters(...args);

    return { type: 'commit' };
  }
);

const mockedPushHistory = jest.fn();
jest.mock(
  '@shopgate/pwa-common/actions/history/pushHistory',
  () => (...args) => {
    mockedPushHistory(...args);

    return { type: 'pushHistory' };
  }
);

describe('FilterChips', () => {
  it('should render empty', () => {
    const wrapper = mount((
      <Provider store={getDefaultStore()}>
        <FilterChips currency="EUR" />
      </Provider>
    ));

    expect(wrapper.html()).toBe(null);
  });

  it('should render all types of filters and remove them on click', () => {
    const wrapper = mount((
      <Provider store={getStoreWithSelectedFilters()}>
        <FilterChips currency="EUR" />
      </Provider>
    ));

    expect(wrapper.html()).not.toBe(null);
    expect(wrapper).toMatchSnapshot();

    const buttons = [];

    wrapper.find('Chip').forEach((chip) => {
      chip.find('Button').forEach(b => buttons.push(b));
    });

    buttons.forEach(b => b.simulate('click'));

    expect(mockedRemoveTemporaryFilter).toHaveBeenCalledTimes(4);
    expect(mockedCommitTemporaryFilters).toHaveBeenCalledTimes(4);
    expect(mockedPushHistory).toHaveBeenCalledTimes(4);
  });
});
