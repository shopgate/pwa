import React from 'react';
import { mount, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { cartState } from '@shopgate/pwa-common-commerce/cart/mock';
import { CART_MAX_ITEMS } from 'Pages/Cart/constants';
import CartButtonBadge from './components/CartButtonBadge';

const mockedStore = configureStore();
let store;

describe('<CartButton />', () => {
  // eslint-disable-next-line require-jsdoc
  const createComponent = (state) => {
    // eslint-disable-next-line global-require
    const CartButton = require('./index').default;
    store = mockedStore({
      ...state,
      navigator: { showCartIcon: true },
    });
    return mount(<CartButton store={store} />);
  };

  it('should not be visible with prop visible set to false', () => {
    const wrapper = shallow((
      <CartButton cartProductCount={0} visible={false} activeCartRoute={false} />
    ));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(CartButtonBadge).render().text()).toBe('0');

    const buttonProps = wrapper.find('button').props();
    expect(buttonProps.style).toEqual({});
  });

  it('should render with cartProductCount beeing set to 1', () => {
    const wrapper = createComponent(cartState);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(CartButtonBadge).render().text()).toBe('1');
  });

  it('should show \'99+\' if the cart amount is higher', () => {
    const state = {
      ...cartState,
      cart: {
        ...cartState.cart,
        items: [
          {
            ...cartState.cart.items[0],
            quantity: 115,
          },
        ],
      },
    };

    const wrapper = createComponent(state);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(CartButtonBadge).render().text()).toBe(`${CART_MAX_ITEMS}+`);
  });

  it('should transition if it has cart amount', () => {
    const wrapper = createComponent(cartState);
    expect(wrapper).toMatchSnapshot();
    const buttonProps = wrapper.find('button').props();
    expect(buttonProps.style.transitionDelay).toBe('600ms');
    expect(buttonProps.style.minWidth).toBe(56);
    expect(buttonProps.style.transform).toBe('translate3d(0, 0, 0)');
  });

  it('should not delay transition when the cart page is left', () => {
    // eslint-disable-next-line global-require
    const { UnwrappedCartButton } = require('./index');
    const wrapper =
            shallow(<UnwrappedCartButton cartProductCount={5} visible activeCartRoute={false} />);
    expect(wrapper.state().useAnimationDelay).toBe(true);

    // Visit the cart route ...
    wrapper.setProps({ activeCartRoute: true });
    expect(wrapper.state().useAnimationDelay).toBe(true); // We want animation here.

    // Leave the cart route.
    wrapper.setProps({ activeCartRoute: false });
    expect(wrapper.state().useAnimationDelay).toBe(false); // We don't want animation here!});
  });

  it('should navigate on click', () => {
    const wrapper = createComponent(cartState);
    wrapper.find('button').simulate('click', { preventDefault: () => {} });

    const result = [{
      type: 'NAVIGATE',
      action: 'PUSH',
      location: '/cart',
      state: undefined,
    }];
    expect(store.getActions()).toEqual(result);
  });
});
