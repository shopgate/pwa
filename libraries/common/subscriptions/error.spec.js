import {
  init,
  addBreadcrumb,
  setTags,
  captureEvent,
} from '@sentry/browser';
import { emitter } from '@shopgate/pwa-core';
import { SOURCE_CONSOLE } from '@shopgate/pwa-core/constants/ErrorManager';
import appConfig from '../helpers/config';
import { appWillInit$ } from '../streams/app';
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

describe('Error subscriptions', () => {
  let addEventListener;

  beforeEach(() => {
    jest.clearAllMocks();
    mockEnv = 'development';
    addEventListener = jest.spyOn(window, 'addEventListener');
  });

  afterEach(() => {
    addEventListener.mockRestore();
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

    it('should send URLs without query strings and a minimal router stack', () => {
      const event = sentryOptions().beforeSend({
        level: 'error',
        request: {
          url: 'https://shop.example/reset?email=jane@example.com',
          headers: { Referer: 'https://shop.example/login?email=jane@example.com' },
        },
      }, {});

      expect(event.request.url).toBe('https://shop.example/reset');
      expect(event.request.headers.Referer).toBe('https://shop.example/login');
      expect(event.extra.routerStack).toEqual([{
        pattern: '/reset/:token',
        pathname: '/reset/abc',
      }]);
    });

    it('should strip query strings from navigation breadcrumbs', () => {
      const breadcrumb = sentryOptions().beforeBreadcrumb({
        category: 'navigation',
        data: {
          from: '/login?email=jane@example.com',
          to: '/reset?token=abc',
        },
      });

      expect(breadcrumb.data).toEqual({
        from: '/login',
        to: '/reset',
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
      callback({ action: { error: pipelineError } });

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

    it('should leave window.onerror to Sentry', () => {
      expect(window.onerror).toBeNull();
    });

    it('should send console errors as text', () => {
      const scope = {
        setLevel: jest.fn(),
        setExtra: jest.fn(),
      };
      jest.requireMock('@sentry/browser').withScope.mockImplementationOnce(callback => callback(scope));
      const [, onConsoleError] = emitter.addListener.mock.calls
        .find(([source]) => source === SOURCE_CONSOLE);

      onConsoleError(['Request failed', new Error('boom'), { mail: 'jane@example.com' }]);

      expect(scope.setExtra).toHaveBeenCalledWith('error', ['Request failed', 'boom', '[object Object]']);
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
