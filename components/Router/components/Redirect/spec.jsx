/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import Redirect from './index';

// Mock the redux connect() method instead of providing a fake store.
jest.mock('./connector', () => obj => obj);

const loginUrl = '/login';
const checkoutUrl = '/checkout';

describe('<Redirect />', () => {
  it('should redirect correctly', () => {
    const redirectSpy = jest.fn();
    const registerSpy = jest.fn();

    const wrapper = shallow(
      <Redirect to={loginUrl} path={checkoutUrl} trampolineRedirect={redirectSpy} />,
      { context: { registerRoute: registerSpy } }
    );

    // Check that registerRoute is called correctly
    expect(registerSpy).toHaveBeenCalled();
    // Check that the first param of the registerRoute call is the path
    expect(registerSpy.mock.calls[0][0]).toBe(checkoutUrl);

    const location = {
      pathname: checkoutUrl,
    };

    // Simulate a addRoute
    wrapper.instance().addRoute(location);

    // Check that trampolineRedirect is called correctly
    expect(redirectSpy).toHaveBeenCalledWith({
      pathname: loginUrl,
    }, location);
  });
});
