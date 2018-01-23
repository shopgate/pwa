/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import RippleButton from 'Components/RippleButton';
import CheckoutButton from './index';

// Mock the history connector
jest.mock('./connector', () => (obj) => {
  const newObj = obj;

  newObj.defaultProps = {
    ...newObj.defaultProps,
    pushHistory: () => {},
    isActive: false,
  };

  return newObj;
});

describe('<CheckoutButton /', () => {
  jest.useFakeTimers();

  let wrapper;
  let childButton;

  describe('Checkout is possible', () => {
    beforeEach(() => {
      wrapper = shallow(
        <CheckoutButton />
      );

      childButton = wrapper.find(RippleButton);
    });

    it('should render without any props', () => {
      expect(wrapper).toMatchSnapshot();
      expect(childButton.props().disabled).toBe(true);
    });

    it('should trigger a pushHistory on click', () => {
      const pushHistorySpy = jest.fn();

      wrapper.setProps({
        pushHistory: pushHistorySpy,
      });

      childButton.simulate('click');

      jest.runOnlyPendingTimers();

      // Check if the command was called
      expect(pushHistorySpy).toHaveBeenCalledTimes(1);
      expect(pushHistorySpy).toBeCalledWith(CHECKOUT_PATH);

      // Check if the execution of  click handler was delayed
      expect(setTimeout.mock.calls.length).toBe(1);
      expect(setTimeout.mock.calls[0][1]).toBe(CheckoutButton.clickDelay);
    });
  });

  describe('Checkout is not possible', () => {
    beforeEach(() => {
      wrapper = shallow(
        <CheckoutButton checkoutPossible={false} />
      );

      childButton = wrapper.find(RippleButton);
    });

    it('should not trigger the pushHistory on click', () => {
      const pushHistorySpy = jest.fn();

      wrapper.setProps({
        pushHistory: pushHistorySpy,
      });

      childButton.simulate('click');

      expect(pushHistorySpy).toHaveBeenCalledTimes(0);
    });
  });
});
