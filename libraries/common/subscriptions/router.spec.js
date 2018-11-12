import { router } from '@virtuous/conductor';
import {
  ACTION_POP,
  ACTION_PUSH,
  ACTION_REPLACE,
  ACTION_RESET,
} from '@virtuous/conductor';
import { redirects } from '@shopgate/pwa-common/collections';
import { logger } from '@shopgate/pwa-core/helpers';
import setViewLoading from '../actions/view/setViewLoading';
import unsetViewLoading from '../actions/view/unsetViewLoading';
import { historyRedirect } from '../actions/router';
import authRoutes from '../collections/AuthRoutes';
import * as handler from './helpers/handleLinks';
import { navigate$ } from '../streams';
import { navigate } from '../action-creators';
import subscriptions from './router';

jest.unmock('@shopgate/pwa-core');
jest.mock('@virtuous/conductor', () => ({
  pop: jest.fn(),
  push: jest.fn(),
  reset: jest.fn(),
  replace: jest.fn(),
}));

jest.mock('@shopgate/pwa-core/classes/AppCommand');
jest.mock('@virtuous/conductor-helpers/getCurrentRoute', () => jest.fn());

let mockedShopCNAME = null;
let mockedWebCheckoutConfig = null;
jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get shopCNAME() { return mockedShopCNAME; },
  get webCheckoutShopify() { return mockedWebCheckoutConfig; },
}));

jest.mock('@shopgate/pwa-core/helpers/logGroup', () => jest.fn());
jest.mock('../actions/router', () => ({
  historyRedirect: jest.fn(),
}));
jest.mock('../actions/view/setViewLoading', () => jest.fn());
jest.mock('../actions/view/unsetViewLoading', () => jest.fn());

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
    jest.spyOn(logger, 'error').mockImplementation();

    // Setup a protected route
    authRoutes.set(protectedRoute, protectorRoute);
    getCurrentRoute.mockReturnValue({ pathname: protectorRoute });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockedShopCNAME = null;
    mockedWebCheckoutConfig = null;
    subscriptions(subscribe);
  });

  it('should subscribe as expected', async () => {
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
        router.pop,
        router.push,
        router.reset,
        router.replace,
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
      redirects.constructor();
    });

    it('should setup as expected', () => {
      expect(stream).toEqual(navigate$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should not do anything when no suitable action is passed', async () => {
      await callback(createCallbackPayload({ params: { action: 'W00P' } }));
      testExpectedCall();
    });

    it('should handle the ACTION_POP history action as expected', async () => {
      await callback(createCallbackPayload({ params: { action: ACTION_POP } }));
      testExpectedCall(router.pop);
    });

    it('should handle the ACTION_RESET history action as expected', async () => {
      await callback(createCallbackPayload({ params: { action: ACTION_RESET } }));
      testExpectedCall(router.reset);
    });

    it('should handle the ACTION_PUSH history action as expected', async () => {
      getState.mockReturnValueOnce({ user: { login: { isLoggedIn: true } } });

      const params = {
        action: ACTION_PUSH,
        pathname: '/some_route',
        state: {},
        silent: true,
      };

      await callback(createCallbackPayload({ params }));
      testExpectedCall(router.push, params);
    });

    it('should handle the ACTION_REPLACE history action as expected', async () => {
      const params = {
        action: ACTION_REPLACE,
        pathname: '/some_route',
        silent: false,
      };

      await callback(createCallbackPayload({ params }));
      testExpectedCall(router.replace, params);
    });

    it('should remove trailing slashes from pathnames', async () => {
      const params = {
        action: ACTION_PUSH,
        pathname: '/some_route/',
        state: {},
        silent: true,
      };

      await callback(createCallbackPayload({ params }));
      testExpectedCall(router.push, {
        ...params,
        pathname: params.pathname.slice(0, -1),
      });
    });

    it('should redirect to a protector route when the user is not logged in', async () => {
      getState.mockReturnValueOnce({ user: { login: { isLoggedIn: false } } });

      const params = {
        action: ACTION_PUSH,
        pathname: protectedRoute,
        silent: false,
      };

      await callback(createCallbackPayload({ params }));
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

    it('should not redirect to a protector route when the user is logged in', async () => {
      getState.mockReturnValueOnce({ user: { login: { isLoggedIn: true } } });

      const params = {
        action: ACTION_PUSH,
        pathname: protectedRoute,
        state: {},
        silent: true,
      };

      await callback(createCallbackPayload({ params }));

      testExpectedCall(router.push, params);
    });

    it('should redirect to another location correctly', async () => {
      redirects.set('/some_route', '/some_other_route');

      const params = {
        action: ACTION_PUSH,
        pathname: '/some_route',
      };

      await callback(createCallbackPayload({ params }));
      testExpectedCall(router.push);
      expect(router.push).toHaveBeenCalledWith('/some_other_route', params.state, params.silent);
    });

    it('should redirect to another location when the redirect handler is a promise', async () => {
      /**
       * @return {Promise}
       */
      const redirectHandler = () => Promise.resolve('/some_other_route');

      redirects.set('/some_route', redirectHandler);

      const params = {
        action: ACTION_PUSH,
        pathname: '/some_route',
      };

      await callback(createCallbackPayload({ params }));
      expect(router.push).toHaveBeenCalledTimes(1);
      expect(router.push).toHaveBeenCalledWith('/some_other_route', params.state, params.silent);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(setViewLoading).toHaveBeenCalledWith(protectorRoute);
      expect(unsetViewLoading).toHaveBeenCalledWith(protectorRoute);
    });

    it('should abort navigation when a redirect handler rejects', async () => {
      const error = new Error('W00ps');

      /**
       * @return {Promise}
       */
      const redirectHandler = () => Promise.reject(error);
      redirects.set('/some_route', redirectHandler);

      const params = {
        action: ACTION_PUSH,
        pathname: '/some_route',
      };

      await expect(callback(createCallbackPayload({ params }))).resolves.toBe();
      expect(router.push).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(error);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(setViewLoading).toHaveBeenCalledWith(protectorRoute);
      expect(unsetViewLoading).toHaveBeenCalledWith(protectorRoute);
    });

    it('should convert shop links as expected', async () => {
      mockedShopCNAME = 'm.awesomeshop.com';

      const params = {
        action: ACTION_PUSH,
        pathname: `https://${mockedShopCNAME}/some_route`,
      };

      await callback(createCallbackPayload({ params }));
      testExpectedCall(router.push);
      expect(router.push).toHaveBeenCalledWith('/some_route', params.state, params.silent);
    });

    it('should handle external links like expected', async () => {
      const params = {
        action: ACTION_PUSH,
        pathname: 'https://www.awesome-shop.com/some_route',
      };

      await callback(createCallbackPayload({ params }));
      testExpectedCall(openExternalLinkSpy);
      expect(openExternalLinkSpy).toHaveBeenCalledWith(params.pathname, params.action);
    });

    it('should handle native links like expected', async () => {
      /**
       * Replace the implementation of handler.openNative link temporarily. It reassigns
       * window.location.href intenrnally, which would cause a jest error.
       */
      openNativeLinkSpy.mockImplementationOnce(() => {});
      const params = {
        action: ACTION_PUSH,
        pathname: 'tel:+49123456789',
      };

      await callback(createCallbackPayload({ params }));
      testExpectedCall(openNativeLinkSpy);
      expect(openNativeLinkSpy).toHaveBeenCalledWith(params.pathname);
    });

    it('should open a legacy page as expected', async () => {
      const params = {
        action: ACTION_PUSH,
        pathname: '/page/imprint',
      };

      await callback(createCallbackPayload({ params }));
      testExpectedCall(openLegacySpy);
      expect(openLegacySpy).toHaveBeenCalledWith(params.pathname, params.action);
    });

    it('should open a legacy link as expected', async () => {
      const params = {
        action: ACTION_PUSH,
        pathname: handler.LEGACY_LINK_ACCOUNT,
      };

      await callback(createCallbackPayload({ params }));
      testExpectedCall(openLegacyLinkSpy);
      expect(openLegacyLinkSpy).toHaveBeenCalledWith(params.pathname, params.action);
    });
  });

  describe('redirectUser$', () => {
    let callback;

    beforeEach(() => {
      [, [, callback]] = subscribe.mock.calls;
    });

    it('should redirect when no web checkout config is set', () => {
      const redirect = {
        pathname: protectedRoute,
        state: {},
      };

      callback(createCallbackPayload({ redirect }));
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(historyRedirect).toHaveBeenCalledWith(redirect);
    });

    it('should not redirect when a web checkout config is set', () => {
      mockedWebCheckoutConfig = { config: 'key' };

      const redirect = {
        pathname: protectedRoute,
        state: {},
      };

      callback(createCallbackPayload({ redirect }));
      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});
