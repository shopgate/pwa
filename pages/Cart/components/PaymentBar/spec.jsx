import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import I18n from '@shopgate/pwa-common/components/I18n';
import SubTotal from './components/Content/components/SubTotal';
import ShippingCosts from './components/Content/components/ShippingCosts';
import Content from './components/Content';
import PaymentBar from './index';

const mockedStore = configureStore();

/**
 * @param {Object} obj Some object.
 * @returns {Object}
 */
function mockedSizeMe(obj) {
  return obj;
}

jest.mock('react-sizeme', () => () => mockedSizeMe);

/**
 * Mock the connect() methods of the relevant sub-components.
 */
jest.mock('./components/Content/components/CheckoutButton/connector', () => (obj) => {
  const newObj = obj;

  newObj.defaultProps = {
    ...newObj.defaultProps,
    isActive: true,
    pushHistory: () => {},
  };

  return newObj;
});

jest.mock('./components/Content/components/ShippingCosts/connector', () => (obj) => {
  const newObj = obj;

  newObj.defaultProps = {
    ...newObj.defaultProps,
    isDisabled: false,
    currency: 'USD',
    value: 2.99,
  };

  return newObj;
});

jest.mock('./components/Content/components/ShippingCostsLabel/connector', () => (obj) => {
  const newObj = obj;

  newObj.defaultProps = {
    ...newObj.defaultProps,
    isDisabled: false,
    shipping: 2.99,
  };

  return obj;
});

jest.mock('./components/Content/components/SubTotal/connector', () => (obj) => {
  const newObj = obj;

  newObj.defaultProps = {
    ...newObj.defaultProps,
    isDisabled: false,
    currency: 'USD',
    value: 4.99,
  };

  return newObj;
});

jest.mock('./components/Content/components/SubTotalLabel/connector', () => (obj) => {
  const newObj = obj;

  newObj.defaultProps = {
    ...newObj.defaultProps,
    isDisabled: false,
  };

  return newObj;
});

describe('<PaymentBar />', () => {
  const testLocales = {
    'shipping.free_short': 'Free',
  };

  const langCode = 'en-US';

  /**
   * Renders the component.
   * @param {Object} props The component props.
   * @return {Object} The mounted component.
   */
  const renderComponent = (props = {}) => mount(
    <Provider store={mockedStore()}>
      <I18n.Provider lang={langCode} locales={testLocales}>
        <PaymentBar {...props} currency="USD" />
      </I18n.Provider>
    </Provider>,
    mockRenderOptions
  );

  it('should render without any props', () => {
    const wrapper = renderComponent();
    expect(wrapper).toMatchSnapshot();
  });

  it('should show the formatted subtotal', () => {
    const wrapper = renderComponent({});
    const component = wrapper.find(Content);

    expect(wrapper).toMatchSnapshot();
    expect(component.find(SubTotal).text()).toEqual('$4.99');
  });

  it('should show formatted shipping costs', () => {
    const wrapper = renderComponent({});
    const component = wrapper.find(Content);

    expect(wrapper).toMatchSnapshot();
    expect(component.find(ShippingCosts).text()).toEqual('$2.99');
  });

  it('should disable the component, if the isDisabled prop is true', () => {
    const wrapper = renderComponent({ isDisabled: true });

    expect(wrapper).toMatchSnapshot();
  });

  it('should be visible if prop isVisible is true', () => {
    const wrapper = renderComponent({ isVisible: true });

    expect(wrapper.find('FormatPrice').exists()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it('should not be visible if prop isVisible is false', () => {
    const wrapper = renderComponent({ isVisible: false });

    expect(wrapper.find('FormatPrice').exists()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });
});
