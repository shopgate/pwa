/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import RippleButton from 'Components/RippleButton';
import CheckoutButton from './index';

// Mock the history connector
jest.mock('./connector', () => (obj) => {
  const newObj = obj;

  newObj.defaultProps = {
    ...newObj.defaultProps,
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
      wrapper = shallow(<CheckoutButton />);
      childButton = wrapper.find(RippleButton);
    });

    it('should render without any props', () => {
      expect(wrapper).toMatchSnapshot();
      expect(childButton.props().disabled).toBe(true);
    });
  });
});
