import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { ACTION_POP, ACTION_PUSH } from '@virtuous/conductor/constants';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { NAVIGATE } from '@shopgate/pwa-common/constants/ActionTypes';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { emptyState, cartState, couponState } from '@shopgate/pwa-common-commerce/cart/mock';
import Cart from './index';

jest.mock('Components/View');
jest.mock('@virtuous/react-conductor/Router', () => ({
  RouteContext: {
    Consumer: props => props.children({ visible: true }),
  },
}));

let store;

/**
 * Creates component
 * @param {boolean} state State that would be used for store.
 * @return {ReactWrapper}
 */
const createComponent = (state) => {
  const mockedStore = configureStore([thunk]);
  store = mockedStore(state);

  return mount(
    <Provider store={store} >
      <Cart />
    </Provider>,
    mockRenderOptions
  );
};

describe('<Cart> page', () => {
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

      expect(actions[0]).toEqual({
        type: NAVIGATE,
        params: {
          action: ACTION_POP,
        },
      });
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
      component.find('Connect(Product)').find('Link').simulate('click');
      component.update();
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: NAVIGATE,
        params: {
          pathname: `${ITEM_PATH}/746573745f70726f64756374`,
          state: {},
          action: ACTION_PUSH,
        },
      });
    });

    it('should render a coupon', () => {
      const component = createComponent(couponState);
      expect(component).toMatchSnapshot();
      expect(component.find('Coupon').length).toEqual(1);
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
