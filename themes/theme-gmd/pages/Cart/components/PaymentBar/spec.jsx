import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import I18n from '@shopgate/pwa-common/components/I18n';
import { LoadingProvider } from '@shopgate/pwa-common/providers';
import SubTotalAmount from './components/Content/components/SubTotal/components/Amount';
import ShippingCostsAmount from './components/Content/components/ShippingCosts/components/Amount';
import Content from './components/Content';
import PaymentBar from './index';

const mockedStore = configureStore();
jest.mock('../../../../components/View/context.js');

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

jest.mock('./components/Content/components/ShippingCosts/components/Amount/connector', () => (obj) => {
  const newObj = obj;

  newObj.defaultProps = {
    ...newObj.defaultProps,
    isDisabled: false,
    currency: 'USD',
    value: 2.99,
  };

  return newObj;
});

jest.mock('./components/Content/components/ShippingCosts/components/Label/connector', () => (obj) => {
  const newObj = obj;

  newObj.defaultProps = {
    ...newObj.defaultProps,
    isDisabled: false,
    shipping: 2.99,
  };

  return obj;
});

jest.mock('./components/Content/components/SubTotal/components/Amount/connector', () => (obj) => {
  const newObj = obj;

  newObj.defaultProps = {
    ...newObj.defaultProps,
    isDisabled: false,
    currency: 'USD',
    value: 4.99,
  };

  return newObj;
});

describe('<PaymentBar />', () => {
  const testLocales = {
    'shipping.free_short': 'Free',
  };

  const langCode = 'en-US';

  const portal = global.document.createElement('div');
  portal.setAttribute('id', 'AppFooter');

  const body = global.document.querySelector('body');
  body.appendChild(portal);

  /**
   * Renders the component.
   * @param {Object} props The component props.
   * @return {Object} The mounted component.
   */
  const renderComponent = (props = {}) => mount(
    <Provider store={mockedStore()}>
      <I18n.Provider lang={langCode} locales={testLocales}>
        <LoadingProvider>
          <PaymentBar {...props} currency="USD" />
        </LoadingProvider>
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
    expect(component.find(SubTotalAmount).text()).toEqual('$4.99');
  });

  it('should show formatted shipping costs', () => {
    const wrapper = renderComponent({});
    const component = wrapper.find(Content);

    expect(wrapper).toMatchSnapshot();
    expect(component.find(ShippingCostsAmount).text()).toEqual('$2.99');
  });

  it('should disable the component, if the isDisabled prop is true', () => {
    const wrapper = renderComponent({ isDisabled: true });

    expect(wrapper).toMatchSnapshot();
  });

  it('should be visible if prop visible is true', () => {
    const wrapper = renderComponent({ visible: true });

    expect(wrapper.find('FormatPrice').exists()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it('should not be visible if prop visible is false', () => {
    const wrapper = renderComponent({ visible: false });

    expect(wrapper.find('FormatPrice').exists()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });
});
