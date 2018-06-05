import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { MockedView } from 'Components/View/mock';
import { mount } from 'enzyme';
import { ACTION_POP, ACTION_PUSH } from '@virtuous/conductor/constants';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { NAVIGATE } from '@shopgate/pwa-common/constants/ActionTypes';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { emptyState, cartState, couponState } from '@shopgate/pwa-common-commerce/cart/mock';

const mockedView = MockedView;
jest.mock('Components/View', () => mockedView);

let store;

/**
 * Creates component
 * @param {boolean} state State that would be used for store.
 * @return {ReactWrapper}
 */
const createComponent = (state) => {
  const mockedStore = configureStore([thunk]);
  store = mockedStore(state);
  /* eslint-disable global-require */
  const Cart = require('./index').default;
  /* eslint-enable global-require */
  return mount(
    <Provider store={store} >
      <Cart />
    </Provider>,
    mockRenderOptions
  );
};

describe('<Cart> page', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('Initial page', () => {
    it('should render empty', () => {
      const component = createComponent(emptyState);
      expect(component).toMatchSnapshot();
      expect(component.find('Cart').length).toEqual(1);
      expect(component.find('Empty').length).toEqual(1);
      expect(component.find('RippleButton').length).toEqual(1);
    });

    it('should navigate back on button press', () => {
      const component = createComponent(emptyState);
      expect(component).toMatchSnapshot();
      component.find('RippleButton').simulate('click');
      component.update();
      const actions = store.getActions();
      expect(actions[0].type).toEqual(NAVIGATE);
      expect(actions[0].action).toEqual(ACTION_POP);
    });

    it('should render with items', () => {
      const component = createComponent(cartState);
      expect(component).toMatchSnapshot();
      expect(component.find('Cart').length).toEqual(1);
      expect(component.find('Connect(Product)').length).toEqual(1);
      expect(component.find('PaymentBar').length).toEqual(1);
      expect(component.find('CouponField').length).toEqual(1);
      expect(component.find('Footer').length).toEqual(1);
    });

    it('should navigate to PDP on item tap', () => {
      const component = createComponent(cartState);
      component.first('Connect(Product)').find('Link').simulate('click');
      component.update();
      const actions = store.getActions();

      expect(actions[0].type).toEqual(NAVIGATE);
      expect(actions[0].action).toEqual(ACTION_PUSH);
      expect(actions[0].location).toEqual(`${ITEM_PATH}/746573745f70726f64756374`);
    });

    it('should render coupon', () => {
      const component = createComponent(couponState);
      expect(component).toMatchSnapshot();
      expect(component.find('CouponField').length).toEqual(1);
    });

    it('should toggle payment bar coupon field focus', () => {
      const component = createComponent(couponState);
      expect(component.find('CouponField').instance().state.isFocused).toBeFalsy();
      expect(component.find('PaymentBar').props().isVisible).toEqual(true);

      component.find('CouponField').find('input').simulate('focus');
      component.update();

      expect(component.find('CouponField').instance().state.isFocused).toEqual(true);
      expect(component.find('PaymentBar').props().isVisible).toEqual(false);
    });
  });
});
