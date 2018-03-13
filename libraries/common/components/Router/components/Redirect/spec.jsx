import React from 'react';
import { shallow } from 'enzyme';
import Redirect from './index';
import {
  LOGIN_PATH,
  CHECKOUT_PATH,
} from '../../../../constants/RoutePaths';

// Mock the redux connect() method instead of providing a fake store.
jest.mock('./connector', () => obj => obj);

describe('<Redirect />', () => {
  it('should redirect correctly', () => {
    const redirectSpy = jest.fn();
    const registerSpy = jest.fn();

    const wrapper = shallow(
      <Redirect to={LOGIN_PATH} path={CHECKOUT_PATH} trampolineRedirect={redirectSpy} />,
      { context: { registerRoute: registerSpy } }
    );

    // Check that registerRoute is called correctly
    expect(registerSpy).toHaveBeenCalled();
    // Check that the first param of the registerRoute call is the path
    expect(registerSpy.mock.calls[0][0]).toBe(CHECKOUT_PATH);

    const location = {
      pathname: CHECKOUT_PATH,
    };

    // Simulate a addRoute
    wrapper.instance().addRoute(location);

    // Check that trampolineRedirect is called correctly
    expect(redirectSpy).toHaveBeenCalledWith({
      pathname: LOGIN_PATH,
    }, location);
  });
});
