import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MockedView } from 'Components/View/mock';
import { mount } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { themeConfig as mockThemeConfig } from '@shopgate/pwa-common/helpers/config/mock';
import {
  mockedState,
  mockedEmpty,
} from './mock';

const mockedView = MockedView;
jest.mock('Components/View', () => mockedView);
const mockedStore = configureStore();

const mockedMergeTemporaryFilters = jest.fn();
jest.mock(
  '@shopgate/pwa-common-commerce/filter/action-creators/mergeTemporaryFilters',
  () => (...args) => {
    mockedMergeTemporaryFilters(...args);
    return { type: 'merge' };
  }
);
const mockedRemoveTemporaryFilters = jest.fn();
jest.mock(
  '@shopgate/pwa-common-commerce/filter/action-creators/removeTemporaryFilter',
  () => (...args) => {
    mockedRemoveTemporaryFilters(...args);
    return { type: 'remove' };
  }
);

jest.mock('lodash/debounce', () => cb => (...args) => cb(...args));

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get currency() { return 'USD'; },
  themeConfig: mockThemeConfig,
}));

/**
 * Creates component
 * @return {ReactWrapper}
 * @param {Object} state Component state
 */
const createComponent = (state) => {
  /* eslint-disable global-require */
  const Filter = require('./index').default;
  /* eslint-enable global-require */
  return mount(
    <Provider store={mockedStore(state)}>
      <Filter />
    </Provider>,
    mockRenderOptions
  );
};

beforeEach(() => {
  jest.resetModules();
});

describe.skip('<Filter> page', () => {
  it('should render', () => {
    const component = createComponent(mockedState);
    expect(component.find('Filter').exists()).toBe(true);
    expect(component.find('CardList').children().length).toBeTruthy();
    expect(component).toMatchSnapshot();

    // Should change price range
    component.find('PriceRangeSlider').at(0).instance().onChange([1251, 3000]);
    expect(mockedRemoveTemporaryFilters).not.toHaveBeenCalled();
    expect(mockedMergeTemporaryFilters.mock.calls[0][0]).toEqual({
      display_amount: {
        label: 'Price',
        minimum: 1251,
        maximum: 3000,
        type: 'range',
      },
    });

    // Should remove price range when beyond limits
    component.find('PriceRangeSlider').at(0).instance().onChange([0, 99999]);
    expect(mockedRemoveTemporaryFilters).toHaveBeenCalledTimes(1);
    expect(mockedMergeTemporaryFilters).toHaveBeenCalledTimes(1);
  });

  it('should render empty', () => {
    const component = createComponent(mockedEmpty);
    expect(component.find('Filter').children().length).toBe(0);
  });
});
