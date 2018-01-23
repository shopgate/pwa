/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { CART_MAX_ITEMS } from 'Pages/Cart/constants';
import CartButton from './index';
import CartButtonBadge from './components/CartButtonBadge';

// Mock the showTab() and popTabToRoot() command
jest.mock('@shopgate/pwa-core/commands/showTab');
jest.mock('@shopgate/pwa-core/commands/popTabToRoot');
// Mock the redux connect() method instead of providing a fake store.
jest.mock('./connector', () => obj => obj);

describe('<CartButton />', () => {
  it('should not be visible with prop visible set to false', () => {
    const wrapper = shallow(
      <CartButton cartProductCount={0} visible={false} activeCartRoute={false} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(CartButtonBadge).render().text()).toBe('0');

    const buttonProps = wrapper.find('button').props();
    expect(buttonProps.style).toEqual({});
  });

  it('should render with cartProductCount beeing set to 4', () => {
    const wrapper = shallow(
      <CartButton cartProductCount={4} visible activeCartRoute={false} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(CartButtonBadge).render().text()).toBe('4');
  });

  it('should show \'99+\' if the cart amount is higher', () => {
    const wrapper = shallow(
      <CartButton cartProductCount={115} visible activeCartRoute={false} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(CartButtonBadge).render().text()).toBe(`${CART_MAX_ITEMS}+`);
  });

  it('should transition if it has cart amount', () => {
    const wrapper = shallow(
      <CartButton cartProductCount={5} visible activeCartRoute={false} />
    );

    expect(wrapper).toMatchSnapshot();
    const buttonProps = wrapper.find('button').props();
    expect(buttonProps.style.transitionDelay).toBe('600ms');
    expect(buttonProps.style.minWidth).toBe(56);
    expect(buttonProps.style.transform).toBe('translate3d(0, 0, 0)');
  });

  it('should not delay transition when the cart page is left', () => {
    const wrapper = shallow(
      <CartButton cartProductCount={5} visible activeCartRoute={false} />
    );

    expect(wrapper.state().useAnimationDelay).toBe(true);

    // Visit the cart route ...
    wrapper.setProps({ activeCartRoute: true });
    expect(wrapper.state().useAnimationDelay).toBe(true); // We want animation here.

    // Leave the cart route.
    wrapper.setProps({ activeCartRoute: false });
    expect(wrapper.state().useAnimationDelay).toBe(false); // We don't want animation here!});
  });
});
