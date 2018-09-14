import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { themeConfig as mockThemeConfig } from '@shopgate/pwa-common/helpers/config/mock';
import FilterBar from './index';
import { getDefaultStore } from './mock';

jest.unmock('@shopgate/pwa-core');
jest.mock('@shopgate/pwa-common-commerce/filter/actions/getFilters', () => () => ({ type: 'foo' }));

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get currency() { return 'USD'; },
  themeConfig: mockThemeConfig,
}));

jest.mock('@virtuous/react-conductor/Router', () => ({
  RouteContext: {
    Consumer: props => props.children({ params: { categoryId: '1337' }, id: 'abc-132' }),
  },
}));

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
          setTop={() => {}}
        />
      </Provider>,
      mockRenderOptions
    );

    expect(wrapper).toMatchSnapshot();
  });
});
