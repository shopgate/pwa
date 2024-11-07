import {
  router,
  ACTION_POP,
  ACTION_PUSH,
  ACTION_REPLACE,
  ACTION_RESET,
} from '@virtuous/conductor';
import { LoadingProvider } from '@shopgate/pwa-common/providers';
import { redirects } from '@shopgate/pwa-common/collections';
import { logger } from '@shopgate/pwa-core/helpers';
import { historyRedirect, historyPush, windowOpenOverride } from '../actions/router';
import authRoutes from '../collections/AuthRoutes';
import * as handler from './helpers/handleLinks';
import { navigate$, appWillStart$, windowOpenOverride$ } from '../streams';
import { navigate } from '../action-creators';
import { getIsConnected } from '../selectors/client';
import { getRouterStackIndex } from '../selectors/router';

import ToastProvider from '../providers/toast';
import subscriptions from './router';

jest.unmock('@shopgate/pwa-core');
jest.mock('@shopgate/pwa-core/classes/AppCommand');

jest.mock('@virtuous/conductor', () => ({
  ACTION_POP: 'ACTION_POP',
  ACTION_PUSH: 'ACTION_PUSH',
  ACTION_REPLACE: 'ACTION_REPLACE',
  ACTION_RESET: 'ACTION_RESET',
  router: {
    pop: jest.fn(),
    push: jest.fn(),
    reset: jest.fn(),
    replace: jest.fn(),
    getCurrentRoute: jest.fn(),
    findPattern: jest.fn(),
    patterns: {},
  },
}));

let mockedShopCNAME = null;
let mockedWebCheckoutConfig = null;
jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get shopCNAME() { return mockedShopCNAME; },
  get webCheckoutShopify() { return mockedWebCheckoutConfig; },
  themeConfig: {},
}));
jest.mock('@shopgate/pwa-core/helpers/logGroup', () => jest.fn());
jest.mock('@shopgate/engage/core/helpers', () => ({
  hasWebBridge: jest.fn().mockReturnValue(false),
  hasSGJavaScriptBridge: jest.fn().mockReturnValue(true),
  hasNewServices: jest.fn().mockReturnValue(false),
}));
jest.mock('../actions/router', () => {
  const { windowOpenOverride: windowOpenOriginal } = jest.requireActual('../actions/router');
  return {
    windowOpenOverride: jest.fn((...args) => windowOpenOriginal(...args)),
    historyPush: jest.fn(),
    historyRedirect: jest.fn(),
  };
});
jest.mock('../selectors/router', () => ({
  ...require.requireActual('../selectors/router'),
  getRouterStackIndex: jest.fn().mockReturnValue(0),
}));
jest.mock('../selectors/client', () => ({
  getIsConnected: jest.fn().mockReturnValue(true),
}));

describe('Router subscriptions', () => {
  const protectedRoute = '/protected';
  const protectorRoute = '/login';
  const mockedRouterState = { router: { currentRoute: { pathname: protectorRoute } } };
  const subscribe = jest.fn();
  const dispatch = jest.fn();
  const getState = jest.fn().mockReturnValue(mockedRouterState);
  const events = {
    emit: jest.fn(),
  };

  /**
   * @param {Object} action The action object for the callback payload.
   * @return {Object}
   */
  const createCallbackPayload = action => ({
    dispatch,
    getState,
    action,
    events,
  });

  beforeAll(() => {
    jest.spyOn(logger, 'warn').mockImplementation();
    jest.spyOn(logger, 'error').mockImplementation();

    jest.spyOn(LoadingProvider, 'setLoading');
    jest.spyOn(LoadingProvider, 'unsetLoading');

    // Setup a protected route
    authRoutes.set(protectedRoute, protectorRoute);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockedShopCNAME = null;
    mockedWebCheckoutConfig = null;
    subscriptions(subscribe);
  });

  it('should subscribe as expected', async () => {
    expect(subscribe).toHaveBeenCalledTimes(4);
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
        events.emit,
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

    it('should handle the ACTION_POP history action as expected when the stack is empty', async () => {
      await callback(createCallbackPayload({ params: { action: ACTION_POP } }));
      expect(router.pop).not.toHaveBeenCalled();
    });

    it('should handle the ACTION_POP history action as expected', async () => {
      getRouterStackIndex.mockReturnValueOnce(1);
      await callback(createCallbackPayload({ params: { action: ACTION_POP } }));
      expect(router.pop).toHaveBeenCalled();
    });

    it('should handle the ACTION_RESET history action as expected when the stack is empty', async () => {
      await callback(createCallbackPayload({ params: { action: ACTION_RESET } }));
      expect(router.pop).not.toHaveBeenCalled();
    });

    it('should handle the ACTION_RESET history action as expected', async () => {
      getRouterStackIndex.mockReturnValueOnce(1);
      await callback(createCallbackPayload({ params: { action: ACTION_RESET } }));
      testExpectedCall(router.pop);
    });

    it('should handle the ACTION_PUSH history action as expected', async () => {
      getState.mockReturnValueOnce({
        ...mockedRouterState,
        user: { login: { isLoggedIn: true } },
      });

      const params = {
        action: ACTION_PUSH,
        pathname: '/some_route',
        state: {},
        silent: true,
      };

      await callback(createCallbackPayload({ params }));
      expect(router.push).toHaveBeenCalledWith({
        emitBefore: true,
        emitAfter: true,
        pathname: params.pathname,
        state: params.state,
      });
    });

    it('should handle the ACTION_REPLACE history action as expected', async () => {
      const params = {
        action: ACTION_REPLACE,
        pathname: '/some_route',
        silent: false,
      };

      await callback(createCallbackPayload({ params }));
      expect(router.replace).toHaveBeenCalledWith({
        emitBefore: false,
        emitAfter: false,
        pathname: '/some_route',
        state: undefined,
      });
    });

    it('should remove trailing slashes from pathnames', async () => {
      const params = {
        action: ACTION_PUSH,
        pathname: '/some_route/',
        state: {},
        silent: true,
      };

      await callback(createCallbackPayload({ params }));
      expect(router.push).toHaveBeenCalledWith({
        emitBefore: true,
        emitAfter: true,
        pathname: params.pathname.slice(0, -1),
        state: params.state,
      });
    });

    it('should redirect to a protector route when the user is not logged in', async () => {
      getState.mockReturnValueOnce({
        ...mockedRouterState,
        user: { login: { isLoggedIn: false } },
      });

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
      getState.mockReturnValueOnce({
        ...mockedRouterState,
        user: { login: { isLoggedIn: true } },
      });

      const params = {
        action: ACTION_PUSH,
        pathname: protectedRoute,
        state: {},
        silent: true,
      };

      await callback(createCallbackPayload({ params }));

      expect(router.push).toHaveBeenCalledWith({
        emitBefore: true,
        emitAfter: true,
        pathname: params.pathname,
        state: params.state,
      });
    });

    it('should redirect to another location correctly', async () => {
      redirects.set('/some_route', '/some_other_route');

      const params = {
        action: ACTION_PUSH,
        pathname: '/some_route',
      };

      await callback(createCallbackPayload({ params }));
      expect(router.push).toHaveBeenCalledWith({
        pathname: '/some_other_route',
        state: params.state,
      });
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
      expect(router.push).toHaveBeenCalledWith({
        pathname: '/some_other_route',
        state: params.state,
      });
      expect(LoadingProvider.setLoading).toHaveBeenCalledWith(protectorRoute);
      expect(LoadingProvider.unsetLoading).toHaveBeenCalledWith(protectorRoute);
    });

    it('should redirect from an external URL to an internal one', async () => {
      const productCode = 'abc123';
      const matcher = 'http://www.external.com/:seoName/:productCode';
      const pathname = `http://www.external.com/nice-product-name/${productCode}?query=param`;
      const redirectTarget = `/item/${productCode}`;

      const redirectHandler = jest.fn((params) => {
        expect(params).toEqual({
          dispatch: expect.any(Function),
          getState: expect.any(Function),
          events: expect.any(Object),
          action: {
            params: {
              action: ACTION_PUSH,
              pathname,
            },
            route: expect.any(Object),
            redirectMeta: {
              location: pathname,
              matcher,
              pathParams: {
                seoName: 'nice-product-name',
                productCode,
              },
              queryParams: {
                query: 'param',
              },
            },
          },
        });

        return new Promise((resolve) => {
          resolve(redirectTarget);
        });
      });

      redirects.set(matcher, redirectHandler);

      const params = {
        action: ACTION_PUSH,
        pathname,
      };

      await callback(createCallbackPayload({ params }));

      expect(router.push).toHaveBeenCalledTimes(1);
      expect(router.push).toHaveBeenCalledWith({
        pathname: `${redirectTarget}?query=param`,
        state: params.state,
      });
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
      expect(LoadingProvider.setLoading).toHaveBeenCalledWith(protectorRoute);
      expect(LoadingProvider.unsetLoading).toHaveBeenCalledWith(protectorRoute);
    });

    it('should abort navigation when the url is invalid', async () => {
      const params = {
        action: ACTION_PUSH,
        pathname: '?foo=bar',
      };

      await expect(callback(createCallbackPayload({ params }))).resolves.toBe();
      testExpectedCall(events.emit);
      expect(events.emit).toHaveBeenCalledWith(ToastProvider.ADD, {
        id: 'navigate.error',
        message: 'error.general',
      });
    });

    it('should abort navigation when the redirect url is invalid', async () => {
      /**
       * @return {Promise}
       */
      const redirectHandler = () => Promise.resolve('?foo=bar');

      redirects.set('/some_route', redirectHandler);

      const params = {
        action: ACTION_PUSH,
        pathname: '/some_route',
      };

      await expect(callback(createCallbackPayload({ params }))).resolves.toBe();
      testExpectedCall(events.emit);
      expect(events.emit).toHaveBeenCalledWith(ToastProvider.ADD, {
        id: 'navigate.error',
        message: 'error.general',
      });
    });

    it('should convert shop links as expected', async () => {
      mockedShopCNAME = 'm.awesomeshop.com';

      const params = {
        action: ACTION_PUSH,
        pathname: `https://${mockedShopCNAME}/some_route`,
      };

      await callback(createCallbackPayload({ params }));
      expect(router.push).toHaveBeenCalledWith({
        pathname: '/some_route',
        state: params.state,
      });
    });

    it('should handle external link with trailing slash (G map)', async () => {
      const params = {
        action: ACTION_PUSH,
        pathname: 'https://www.google.com/maps/dir/?api=1&amp;destination=Gro',
      };

      await callback(createCallbackPayload({ params }));
      testExpectedCall(openExternalLinkSpy);
      expect(openExternalLinkSpy).toHaveBeenCalledWith(
        params.pathname,
        params.action,
        mockedRouterState,
        undefined
      );
    });

    it('should handle external links like expected', async () => {
      const params = {
        action: ACTION_PUSH,
        pathname: 'https://www.awesome-shop.com/some_route',
      };

      await callback(createCallbackPayload({ params }));
      testExpectedCall(openExternalLinkSpy);
      expect(openExternalLinkSpy).toHaveBeenCalledWith(
        params.pathname,
        params.action,
        mockedRouterState,
        undefined
      );
    });

    it('should handle external urls with target=_blank as expected', async () => {
      const params = {
        action: ACTION_PUSH,
        pathname: 'https://m.me/facebookID',
        state: {
          target: '_blank',
        },
      };

      await callback(createCallbackPayload({ params }));
      expect(openExternalLinkSpy).toBeCalledTimes(1);
      expect(openExternalLinkSpy).toHaveBeenCalledWith(
        params.pathname,
        params.action,
        mockedRouterState,
        params.state
      );
    });

    it('should handle external urls as expected when they are returned by a redirect handler', async () => {
      const externalUrl = 'https://www.google.com/maps/dir/?api=1&destination=Gro';

      /**
       * @return {Promise}
       */
      const redirectHandler = () => Promise.resolve(externalUrl);

      redirects.set('/register', redirectHandler);

      const params = {
        action: ACTION_PUSH,
        pathname: '/register',
      };

      await callback(createCallbackPayload({ params }));
      testExpectedCall(openExternalLinkSpy);

      expect(openExternalLinkSpy).toHaveBeenCalledWith(
        externalUrl,
        params.action,
        mockedRouterState,
        undefined
      );
    });

    it('should handle native links like expected', async () => {
      /**
       * Replace the implementation of handler.openNative link temporarily. It reassigns
       * window.location.href internally, which would cause a jest error.
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
      expect(openLegacySpy).toHaveBeenCalledWith(params.pathname, params.action, mockedRouterState);
    });

    it('should open a legacy link as expected', async () => {
      const params = {
        action: ACTION_PUSH,
        pathname: handler.LEGACY_LINK_ACCOUNT,
      };

      await callback(createCallbackPayload({ params }));
      testExpectedCall(openLegacyLinkSpy);
      expect(openLegacyLinkSpy).toHaveBeenCalledWith(
        params.pathname,
        params.action,
        mockedRouterState
      );
    });

    it('should cancel navigation when not connected to the internet', async () => {
      getIsConnected.mockReturnValueOnce(false);
      const params = {
        action: ACTION_PUSH,
        pathname: '/some_route',
      };

      await callback(createCallbackPayload({ params }));
      testExpectedCall(events.emit);
      expect(events.emit).toHaveBeenCalledWith(ToastProvider.ADD, {
        id: 'navigate.error',
        message: 'error.general',
      });
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

  describe('appWillStart$', () => {
    let callback;
    let stream;

    beforeEach(() => {
      [,, [stream, callback]] = subscribe.mock.calls;
    });

    it('should setup as expected', () => {
      expect(stream).toEqual(appWillStart$);
      expect(callback).toBeInstanceOf(Function);
    });

    describe('window.open()', () => {
      beforeAll(() => {
        callback(createCallbackPayload({}));
      });

      it('should return null when called and dispatched the windowOpenOverride action', () => {
        const pathname = 'http://some.shop.com/abc123?query=param';
        expect(window.open(pathname)).toBeNull();
        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch).toBeCalledWith(windowOpenOverride({
          pathname,
        }));
      });
    });
  });

  describe('windowOpenOverride$', () => {
    let callback;
    let stream;

    beforeEach(() => {
      [,,, [stream, callback]] = subscribe.mock.calls;
    });

    it('should setup as expected', () => {
      expect(stream).toEqual(windowOpenOverride$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should dispatch historyPush when invoked with an url', () => {
      const pathname = 'http://some.url';

      callback(createCallbackPayload(windowOpenOverride({
        pathname,
      })));

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(historyPush({
        pathname,
      }));
    });

    it('should NOT dispatch historyPush when invoked with an empty url', () => {
      callback(createCallbackPayload(windowOpenOverride({
        pathname: null,
      })));

      expect(dispatch).not.toBeCalled();
    });
  });
});
