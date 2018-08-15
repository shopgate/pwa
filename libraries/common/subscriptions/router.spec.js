import conductor from '@virtuous/conductor';
import {
  ACTION_POP,
  ACTION_PUSH,
  ACTION_REPLACE,
  ACTION_RESET,
} from '@virtuous/conductor/constants';
import { logger } from '@shopgate/pwa-core/helpers';
import authRoutes from '../collections/AuthRoutes';
import * as handler from './helpers/handleLinks';
import { navigate$ } from '../streams';
import { navigate } from '../action-creators';
import subscriptions from './router';

jest.mock('@virtuous/conductor', () => ({
  pop: jest.fn(),
  push: jest.fn(),
  reset: jest.fn(),
  replace: jest.fn(),
}));

let mockedShopCNAME = null;
jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get shopCNAME() { return mockedShopCNAME; },
}));

jest.mock('@shopgate/pwa-core/helpers/logGroup', () => jest.fn());

describe('Router subscriptions', () => {
  const subscribe = jest.fn();
  const dispatch = jest.fn();
  const getState = jest.fn().mockReturnValue({});
  const protectedRoute = '/protected';
  const protectorRoute = '/login';

  /**
   * @param {Object} action The action object for the callback payload.
   * @return {Object}
   */
  const createCallbackPayload = action => ({
    dispatch,
    getState,
    action,
  });

  beforeAll(() => {
    jest.spyOn(logger, 'warn').mockImplementation();

    // Setup a protected route
    authRoutes.set(protectedRoute, protectorRoute);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockedShopCNAME = null;
    subscriptions(subscribe);
  });

  it('should subscribe as expected', () => {
    expect(subscribe).toHaveBeenCalledTimes(2);
  });

  describe('navigate$', () => {
    const openExternalLinkSpy = jest.spyOn(handler, 'openExternalLink');
    const openNativeLinkSpy = jest.spyOn(handler, 'openNativeLink');
    const openLegacySpy = jest.spyOn(handler, 'openLegacy');
    const openLegacyLinkSpy = jest.spyOn(handler, 'openLegacyLink');

    let stream;
    let callback;

    /**
     * Tests if a passed function was called during a test as expected.
     * @param {Function} calledFn The function that was supposed to be called within a test.
     * @param {Object} params Optional params for the function call.
     */
    const testExpectedCall = (calledFn, params) => {
      // All possible functions that might be called within the subscription.
      const haystack = [
        dispatch,
        openNativeLinkSpy,
        openExternalLinkSpy,
        openLegacySpy,
        openLegacyLinkSpy,
        conductor.pop,
        conductor.push,
        conductor.reset,
        conductor.replace,
      ];

      // Split the expected function from the haystack.
      let needle;
      const needleIndex = haystack.findIndex(entry => entry === calledFn);

      if (needleIndex !== -1) {
        [needle] = haystack.splice(needleIndex, 1);
      }

      if (needle) {
        expect(needle).toHaveBeenCalledTimes(1);
      }

      if (params) {
        expect(calledFn).toHaveBeenCalledWith(params.pathname, params.state, params.silent);
      }

      haystack.forEach((entry) => {
        // Check that none of the others is called.
        expect(entry).not.toBeCalled();
      });
    };

    beforeEach(() => {
      [[stream, callback]] = subscribe.mock.calls;
    });

    it('should setup as expected', () => {
      expect(stream).toEqual(navigate$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should not do anything when no suitable action is passed', () => {
      callback(createCallbackPayload({ params: { action: 'W00P' } }));
      testExpectedCall();
    });

    it('should handle the ACTION_POP history action as expected', () => {
      callback(createCallbackPayload({ params: { action: ACTION_POP } }));
      testExpectedCall(conductor.pop);
    });

    it('should handle the ACTION_RESET history action as expected', () => {
      callback(createCallbackPayload({ params: { action: ACTION_RESET } }));
      testExpectedCall(conductor.reset);
    });

    it('should handle the ACTION_PUSH history action as expected', () => {
      getState.mockReturnValueOnce({ user: { login: { isLoggedIn: true } } });

      const params = {
        action: ACTION_PUSH,
        pathname: '/some_route',
        state: {},
        silent: true,
      };

      callback(createCallbackPayload({ params }));
      testExpectedCall(conductor.push, params);
    });

    it('should handle the ACTION_REPLACE history action as expected', () => {
      const params = {
        action: ACTION_REPLACE,
        pathname: '/some_route',
        silent: false,
      };

      callback(createCallbackPayload({ params }));
      testExpectedCall(conductor.replace, params);
    });

    it('should remove trailing slashes from pathnames', () => {
      const params = {
        action: ACTION_PUSH,
        pathname: '/some_route/',
        state: {},
        silent: true,
      };

      callback(createCallbackPayload({ params }));
      testExpectedCall(conductor.push, {
        ...params,
        pathname: params.pathname.slice(0, -1),
      });
    });

    it('should redirect to a protector route when the user is not logged in', () => {
      getState.mockReturnValueOnce({ user: { login: { isLoggedIn: false } } });

      const params = {
        action: ACTION_PUSH,
        pathname: protectedRoute,
        silent: false,
      };

      callback(createCallbackPayload({ params }));
      testExpectedCall(dispatch);
      expect(dispatch).toHaveBeenCalledWith(navigate({
        action: params.action,
        pathname: protectorRoute,
        state: {
          redirect: {
            location: params.pathname,
            state: params.state,
          },
        },
      }));
    });

    it('should not redirect to a protector route when the user is logged in', () => {
      getState.mockReturnValueOnce({ user: { login: { isLoggedIn: true } } });

      const params = {
        action: ACTION_PUSH,
        pathname: protectedRoute,
        state: {},
        silent: true,
      };

      callback(createCallbackPayload({ params }));

      testExpectedCall(conductor.push, params);
    });

    it('should convert shop links as expected', () => {
      mockedShopCNAME = 'm.awesomeshop.com';

      const params = {
        action: ACTION_PUSH,
        pathname: `https://${mockedShopCNAME}/some_route`,
      };

      callback(createCallbackPayload({ params }));
      testExpectedCall(conductor.push);
      expect(conductor.push).toHaveBeenCalledWith('/some_route', params.state, params.silent);
    });

    it('should handle external links like expected', () => {
      const params = {
        action: ACTION_PUSH,
        pathname: 'https://www.awesome-shop.com/some_route',
      };

      callback(createCallbackPayload({ params }));
      testExpectedCall(openExternalLinkSpy);
      expect(openExternalLinkSpy).toHaveBeenCalledWith(params.pathname);
    });

    it('should handle native links like expected', () => {
      /**
       * Replace the implementation of handler.openNative link temporarily. It reassigns
       * window.location.href intenrnally, which would cause a jest error.
       */
      openNativeLinkSpy.mockImplementationOnce(() => {});
      const params = {
        action: ACTION_PUSH,
        pathname: 'tel:+49123456789',
      };

      callback(createCallbackPayload({ params }));
      testExpectedCall(openNativeLinkSpy);
      expect(openNativeLinkSpy).toHaveBeenCalledWith(params.pathname);
    });

    it('should open a legacy page as expected', () => {
      const params = {
        action: ACTION_PUSH,
        pathname: '/page/imprint',
      };

      callback(createCallbackPayload({ params }));
      testExpectedCall(openLegacySpy);
      expect(openLegacySpy).toHaveBeenCalledWith(params.pathname);
    });

    it('should open a legacy link as expected', () => {
      const params = {
        action: ACTION_PUSH,
        pathname: `/${handler.LEGACY_LINK_ACCOUNT}`,
      };

      callback(createCallbackPayload({ params }));
      testExpectedCall(openLegacyLinkSpy);
      expect(openLegacyLinkSpy).toHaveBeenCalledWith(params.pathname);
    });
  });
});
