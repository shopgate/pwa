import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { useWidgetSettings } from '@shopgate/engage/core/hooks/useWidgetSettings';
import { mockedProduct1, mockedStateWithDiscount, mockedStateWithoutDiscount } from './mock';
import ProductDiscountBadge from './index';

jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/core/hooks/useWidgetSettings', () => ({
  useWidgetSettings: jest.fn(),
}));

describe('<ProductDiscountBadge />', () => {
  const mockedStore = configureStore();

  beforeEach(() => {
    useWidgetSettings.mockReturnValue({
      pdp: {
        show: true,
        style: { color: 'blue' },
      },
    });
  });

  /**
   * createComponent
   * @param {Object} mockedState mockedState
   * @return {*}
   */
  const createComponent = (mockedState) => {
    const store = mockedStore(mockedState);
    return mount(
      <Provider store={store}>
        <ProductDiscountBadge productId={mockedProduct1.productId} />
      </Provider>
    );
  };

  it('should render without discount', () => {
    const wrapper = createComponent(mockedStateWithoutDiscount);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with discount', () => {
    const wrapper = createComponent(mockedStateWithDiscount);
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render with discount if widgetSetting is false', () => {
    useWidgetSettings.mockReturnValue({
      pdp: {
        show: false,
        style: {},
      },
    });

    const wrapper = createComponent(mockedStateWithDiscount);
    expect(wrapper).toMatchSnapshot();
  });
});
