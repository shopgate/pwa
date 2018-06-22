import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import FilterBar from './index';
import { getDefaultStore } from './mock';

jest.mock('@shopgate/pwa-common-commerce/filter/actions/getFilters', () => () => ({ type: 'foo' }));

describe('<FilterBar>', () => {
  global.requestAnimationFrame = () => {};

  it('should render', () => {
    const store = getDefaultStore();
    const wrapper = mount(
      <Provider store={store}>
        <FilterBar
          handleToggleViewMode={() => {}}
          handleSortChange={() => {}}
          handleOpenFiltersView={() => {}}
          getFilters={() => {}}
        />
      </Provider>,
      mockRenderOptions
    );

    expect(wrapper).toMatchSnapshot();
  });
});
