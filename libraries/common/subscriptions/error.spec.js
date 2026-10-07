import {
  init,
  addBreadcrumb,
  setTags,
  captureEvent,
  captureException,
  captureMessage,
  withScope,
} from '@sentry/browser';
import { router } from '@virtuous/conductor';
import { emitter } from '@shopgate/pwa-core';
import { SOURCE_CONSOLE, SOURCE_TRACKING } from '@shopgate/pwa-core/constants/ErrorManager';
import appConfig from '../helpers/config';
import { appWillInit$, appDidStart$ } from '../streams/app';
import { appError$ } from '../streams/error';
import { APP_ERROR, PIPELINE_ERROR } from '../constants/ActionTypes';
import { main$ } from '../streams/main';
import { clientInformationDidUpdate$ } from '../streams/client';
import subscription from './error';

jest.mock('@sentry/browser', () => ({
  init: jest.fn(),
  addBreadcrumb: jest.fn(),
  setTags: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  captureEvent: jest.fn(),
  withScope: jest.fn(callback => callback({
    setLevel: jest.fn(),
    setExtra: jest.fn(),
    setTag: jest.fn(),
  })),
}));
jest.mock('@shopgate/pwa-core', () => ({
  ...jest.requireActual('@shopgate/pwa-core'),
  emitter: { addListener: jest.fn() },
}));
let mockEnv = 'development';
jest.mock('../helpers/environment', () => ({
  get env() {
    return mockEnv;
  },
}));
jest.mock('../selectors/router', () => ({
  ...jest.requireActual('../selectors/router'),
  getRouterStack: () => [{
    pattern: '/reset/:token',
    pathname: '/reset/abc',
    location: '/reset/abc?email=jane@example.com',
    query: { email: 'jane@example.com' },
    state: { email: 'jane@example.com' },
  }],
}));

const pipelineError = Object.assign(new Error('Invalid credentials'), {
  code: 'EINVALIDCREDENTIALS',
  context: 'shopgate.user.loginUser.v1',
  handled: true,
  meta: {
    input: {
      login: 'jane@example.com',
      password: 'secret',
    },
  },
});

/**
 * Runs the subscriptions with the given Sentry config and initializes them.
 * @param {Object} sentry The Sentry config.
 * @returns {Array} The subscribed streams and their callbacks.
 */
const setup = (sentry) => {
  appConfig.sentry = sentry;
  const subscriptions = [];
  subscription((stream, callback) => subscriptions.push([stream, callback]));
  subscriptions
    .filter(([stream]) => stream === appWillInit$)
    .forEach(([, callback]) => callback({ getState: () => ({}) }));
  return subscriptions;
};

/**
 * @param {Array} subscriptions The subscriptions from setup.
 * @param {Object} stream The stream to find.
 * @returns {Function} The callback subscribed to the stream.
 */
const callbackFor = (subscriptions, stream) => subscriptions
  .find(([subscribedStream]) => subscribedStream === stream)[1];

/**
 * @returns {Object} The options passed to Sentry's init.
 */
const sentryOptions = () => init.mock.calls[init.mock.calls.length - 1][0];

const routePatterns = {
  '/': /^\/$/,
  '/reset/:token': /^\/reset\/[^/]+$/,
  '/orders/:orderId': /^\/orders\/[^/]+$/,
};

describe('Error subscriptions', () => {
  let addEventListener;
  let findPattern;

  beforeEach(() => {
    jest.clearAllMocks();
    mockEnv = 'development';
    addEventListener = jest.spyOn(window, 'addEventListener');
    findPattern = jest.spyOn(router, 'findPattern').mockImplementation(pathname => (
      Object.keys(routePatterns).find(pattern => routePatterns[pattern].test(pathname)) || null
    ));
  });

  afterEach(() => {
    addEventListener.mockRestore();
    findPattern.mockRestore();
  });

  describe('Sentry level filter', () => {
    const levels = ['fatal', 'error', 'warning', 'info', 'debug'];

    /**
     * @param {string} level The configured level.
     * @returns {Array} The event levels that are sent.
     */
    const sentLevels = (level) => {
      setup({
        enabled: true,
        level,
        sampleRate: 1,
      });
      const { beforeSend } = sentryOptions();
      return levels.filter(eventLevel => beforeSend({ level: eventLevel }, {}) !== null);
    };

    it('should send events from fatal down to the configured level', () => {
      expect(sentLevels('warning')).toEqual(['fatal', 'error', 'warning']);
      expect(sentLevels('error')).toEqual(['fatal', 'error']);
      expect(sentLevels('debug')).toEqual(levels);
    });

    it('should treat critical like error', () => {
      expect(sentLevels('critical')).toEqual(['fatal', 'error']);
    });

    it('should send events without a level', () => {
      setup({
        enabled: true,
        level: 'error',
        sampleRate: 1,
      });
      expect(sentryOptions().beforeSend({}, {})).not.toBeNull();
    });

    it('should not initialize Sentry when it is disabled', () => {
      setup({ enabled: false });
      expect(init).not.toHaveBeenCalled();
    });
  });

  describe('Sentry event data', () => {
    let subscriptions;

    beforeEach(() => {
      subscriptions = setup({
        enabled: true,
        level: 'warning',
        sampleRate: 1,
      });
    });

    it('should drop pipeline errors', () => {
      const { beforeSend } = sentryOptions();
      expect(beforeSend({ level: 'error' }, { originalException: pipelineError })).toBeNull();
      expect(beforeSend({ level: 'error' }, { originalException: new Error('boom') })).not.toBeNull();
    });

    it('should send route patterns instead of URLs with parameters and a minimal router stack', () => {
      const event = sentryOptions().beforeSend({
        level: 'error',
        request: {
          url: 'https://cdn.example/shop_1/theme/index.html/reset/abc?email=jane@example.com#top',
          headers: { Referer: 'https://shop.example/orders/123?email=jane@example.com' },
        },
      }, {});

      expect(event.request.url).toBe('https://cdn.example/shop_1/theme/index.html/reset/:token');
      expect(event.request.headers.Referer).toBe('https://shop.example/orders/:orderId');
      expect(event.extra.routerStack).toEqual([{ pattern: '/reset/:token' }]);
    });

    it('should send route patterns in navigation breadcrumbs', () => {
      const breadcrumb = sentryOptions().beforeBreadcrumb({
        category: 'navigation',
        data: {
          from: '/shop_1/theme/index.html?email=jane@example.com',
          to: '/orders/123',
        },
      });

      expect(breadcrumb.data).toEqual({
        from: '/shop_1/theme/index.html/',
        to: '/orders/:orderId',
      });
    });

    it('should not send paths without a registered route', () => {
      const breadcrumb = sentryOptions().beforeBreadcrumb({
        category: 'navigation',
        data: {
          from: 'https://shop.example/unregistered/jane@example.com',
          to: '/unregistered/abc',
        },
      });

      expect(breadcrumb.data).toEqual({
        from: 'https://shop.example/(unknown route)',
        to: '/(unknown route)',
      });
    });

    it('should add only the action type as Redux breadcrumb', () => {
      callbackFor(subscriptions, main$)({
        action: {
          type: 'RECEIVE_USER',
          user: { mail: 'jane@example.com' },
        },
      });

      expect(addBreadcrumb).toHaveBeenCalledWith({
        category: 'redux',
        message: '[Redux] RECEIVE_USER',
        level: 'info',
      });
    });

    it('should not tag the device id', () => {
      callbackFor(subscriptions, clientInformationDidUpdate$)({
        action: {
          data: {
            appVersion: '5.18.0',
            libVersion: '21.0',
            deviceId: 'device-1',
          },
        },
      });

      expect(setTags).toHaveBeenLastCalledWith({
        appVersion: '5.18.0',
        libVersion: '21.0',
      });
    });

    it('should send user errors without the pipeline input and the backend message', () => {
      const scope = {
        setLevel: jest.fn(),
        setExtra: jest.fn(),
        setTag: jest.fn(),
      };
      jest.requireMock('@sentry/browser').withScope.mockImplementationOnce(callback => callback(scope));
      const [, callback] = subscriptions[subscriptions.length - 1];
      callback({
        action: {
          type: PIPELINE_ERROR,
          error: pipelineError,
        },
      });

      expect(captureEvent).toHaveBeenCalledWith({
        message: 'User error EINVALIDCREDENTIALS',
        extra: {
          code: 'EINVALIDCREDENTIALS',
          pipeline: 'shopgate.user.loginUser.v1',
        },
      });
      expect(scope.setTag.mock.calls).toEqual([
        ['error', 'E_USER'],
        ['errorCode', 'EINVALIDCREDENTIALS'],
      ]);
    });

    it('should send the component stack of a crash and keep its stack trace', () => {
      const scope = {
        setExtra: jest.fn(),
      };
      withScope.mockImplementationOnce(callback => callback(scope));
      const error = Object.assign(new Error('Render failed'), { componentStack: '\n    in Widget' });
      const { stack } = error;

      callbackFor(subscriptions.slice().reverse(), appError$)({
        action: {
          type: APP_ERROR,
          error,
        },
      });

      expect(scope.setExtra.mock.calls).toEqual([['componentStack', '\n    in Widget']]);
      expect(captureException).toHaveBeenCalledWith(error);
      expect(error.stack).toBe(stack);
    });

    it('should not send an event for the app start', () => {
      expect(subscriptions.map(([stream]) => stream)).not.toContain(appDidStart$);
    });

    it('should send a crash as one exception without a user error', () => {
      const error = new Error('Render failed');
      const action = {
        type: APP_ERROR,
        error,
      };

      subscriptions
        .filter(([stream], index) => stream === appError$ || index === subscriptions.length - 1)
        .forEach(([, callback]) => callback({
          action,
          dispatch: jest.fn(),
        }));

      expect(captureException).toHaveBeenCalledTimes(1);
      expect(captureException).toHaveBeenCalledWith(error);
      expect(captureEvent).not.toHaveBeenCalled();
    });

    it('should send an app error without an exception as one user error', () => {
      const action = {
        type: APP_ERROR,
        error: {
          code: 'ECUSTOM',
          message: 'Something failed',
        },
      };

      subscriptions
        .filter(([stream], index) => stream === appError$ || index === subscriptions.length - 1)
        .forEach(([, callback]) => callback({
          action,
          dispatch: jest.fn(),
        }));

      expect(captureException).not.toHaveBeenCalled();
      expect(captureEvent).toHaveBeenCalledTimes(1);
      expect(captureEvent).toHaveBeenCalledWith({
        message: 'User error ECUSTOM',
        extra: {
          code: 'ECUSTOM',
          pipeline: undefined,
        },
      });
    });

    it('should leave window.onerror to Sentry', () => {
      expect(window.onerror).toBeNull();
    });

    describe('console errors', () => {
      let scope;
      let onConsoleError;

      beforeEach(() => {
        scope = {
          setLevel: jest.fn(),
          setTag: jest.fn(),
          setExtra: jest.fn(),
        };
        withScope.mockImplementationOnce(callback => callback(scope));
        [, onConsoleError] = emitter.addListener.mock.calls
          .find(([source]) => source === SOURCE_CONSOLE);
      });

      it('should send a logged error as exception with the other arguments as text', () => {
        const error = new Error('boom');

        onConsoleError(['Request failed', error, { mail: 'jane@example.com' }]);

        expect(captureException).toHaveBeenCalledWith(error);
        expect(scope.setLevel).toHaveBeenCalledWith('error');
        expect(scope.setTag).toHaveBeenCalledWith('source', SOURCE_CONSOLE);
        expect(scope.setExtra).toHaveBeenCalledWith('details', ['Request failed', '{keys: mail}']);
        expect(addBreadcrumb).not.toHaveBeenCalled();
      });

      it('should not add details when only an error is logged', () => {
        onConsoleError([new Error('boom')]);

        expect(scope.setExtra).not.toHaveBeenCalled();
      });

      it('should describe logged objects by their keys and error code without their values', () => {
        onConsoleError([[
          {
            code: 'EINVALID',
            message: 'jane@example.com is not valid',
            path: 'mail',
          },
          { mail: 'jane@example.com' },
        ], null, 42]);

        expect(addBreadcrumb).toHaveBeenCalledWith({
          category: 'logger',
          message: '[{code: "EINVALID", keys: code, message, path}, {keys: mail}] null 42',
          level: 'error',
        });
      });

      it('should send a tracking error once, with its stack trace and the name of the tracker', () => {
        const error = Object.assign(new Error('Plugin failed'), {
          code: 'ETRACKING',
          source: SOURCE_TRACKING,
          context: 'facebookPixel',
        });

        onConsoleError(["'SgTrackingCore': Error in plugin [facebookPixel]", error]);

        expect(captureException).toHaveBeenCalledTimes(1);
        expect(captureException).toHaveBeenCalledWith(error);
        expect(scope.setExtra).toHaveBeenCalledWith('trackerName', 'facebookPixel');
      });

      it('should send the component stack of a logged crash', () => {
        const error = Object.assign(new Error('Render failed'), { componentStack: '\n    in Widget' });

        onConsoleError([error]);

        expect(captureException).toHaveBeenCalledWith(error);
        expect(scope.setExtra.mock.calls).toEqual([['componentStack', '\n    in Widget']]);
      });

      it('should not report the queued copy of a tracking error', () => {
        expect(emitter.addListener.mock.calls.map(([source]) => source)).toEqual([SOURCE_CONSOLE]);
      });

      it('should add a logged text as breadcrumb instead of sending an event', () => {
        onConsoleError(['Unknown form element type:', 'fancy']);

        expect(addBreadcrumb).toHaveBeenCalledWith({
          category: 'logger',
          message: 'Unknown form element type: fancy',
          level: 'error',
        });
        expect(captureException).not.toHaveBeenCalled();
        expect(captureMessage).not.toHaveBeenCalled();
      });
    });
  });

  describe('Unhandled pipeline rejections', () => {
    let info;

    /**
     * @param {*} reason The rejection reason.
     * @returns {Object} The dispatched event.
     */
    const reject = (reason) => {
      const [, listener] = addEventListener.mock.calls
        .find(([type]) => type === 'unhandledrejection');
      const event = {
        reason,
        preventDefault: jest.fn(),
      };
      listener(event);
      return event;
    };

    beforeEach(() => {
      info = jest.spyOn(console, 'info').mockImplementation(() => {});
    });

    afterEach(() => {
      info.mockRestore();
    });

    it('should replace the console error with a hint in development', () => {
      setup({ enabled: false });
      const event = reject(pipelineError);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(info).toHaveBeenCalledWith(expect.stringContaining('EINVALIDCREDENTIALS (Invalid credentials)'));
      expect(info).toHaveBeenCalledWith(expect.stringContaining('The default error handling already handled it'));
    });

    it('should name the exclusion from the default handling for blacklisted errors', () => {
      setup({ enabled: false });
      const event = reject(Object.assign(new Error('Cart error'), {
        code: 'ECART',
        handled: false,
      }));

      expect(event.preventDefault).toHaveBeenCalled();
      expect(info).toHaveBeenCalledWith(expect.stringContaining('ECART (Cart error)'));
      expect(info).toHaveBeenCalledWith(expect.stringContaining('excluded it from the default error handling'));
    });

    it('should log nothing in production', () => {
      mockEnv = 'production';
      setup({ enabled: false });
      const event = reject(pipelineError);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(info).not.toHaveBeenCalled();
    });

    it('should not touch other rejections', () => {
      setup({ enabled: false });
      const event = reject(new Error('boom'));

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(info).not.toHaveBeenCalled();
    });
  });
});
