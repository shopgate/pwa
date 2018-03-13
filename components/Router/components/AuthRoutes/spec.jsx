/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import AuthRoutes from './index';
import MockRoute from '../Route/mock';
import {
  CHECKOUT_PATH,
  LOGIN_PATH,
} from '../../../../constants/RoutePaths';

// Mock the redux connect() method instead of providing a fake store.
jest.mock('./connector', () => obj => obj);

jest.mock('../Redirect/connector', () => (obj) => {
  const newObj = obj;

  newObj.defaultProps = {
    trampolineRedirect: () => {},
  };

  return newObj;
});

describe('<AuthRoutes />', () => {
  let authWrapper;

  beforeEach(() => {
    authWrapper = mount(
      (
        <AuthRoutes to={LOGIN_PATH} isLoggedIn={false}>
          <MockRoute path={CHECKOUT_PATH} component="checkout" />
        </AuthRoutes>
      ), { context: { registerRoute: () => {} } }
    );
  });

  describe('Given the user is logged in', () => {
    beforeEach(() => {
      authWrapper.setProps({ isLoggedIn: true });
    });

    it('should render the Route without any redirect', () => {
      expect(authWrapper.find('MockRoute').exists()).toBe(true);
      expect(authWrapper.find('Redirect').exists()).toBe(false);
      expect(authWrapper).toMatchSnapshot();
    });
  });

  describe('Given the user is logged out', () => {
    beforeEach(() => {
      authWrapper.setProps({ isLoggedIn: false });
    });

    it('should render the redirect', () => {
      expect(authWrapper.find('MockRoute').exists()).toBe(false);
      expect(authWrapper.find('Redirect').exists()).toBe(true);
      expect(authWrapper).toMatchSnapshot();
    });

    it('should pass the correct props to redirect component', () => {
      const props = authWrapper.find('Redirect').props();

      expect(props).toMatchObject({
        to: LOGIN_PATH,
        path: CHECKOUT_PATH,
      });
    });
  });
});
