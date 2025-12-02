/** @jest-environment jsdom */

/* eslint global-require: "off" */
/* eslint no-unused-expressions: "off" */
/* eslint class-methods-use-this: "off" */
import storageMock from './helpers/localStorage-mock';
import { sgData } from './data/tracking.testData';

describe('Core', () => {
  let SgTrackingCore = null;

  const trackableEvents = [
    'setCampaignWithUrl',
    'pageview',
    'viewContent',
    'variantSelected',
    'purchase',
    'addToCart',
    'addToWishlist',
    'initiatedCheckout',
    'completedRegistration',
    'search',
    'addedPaymentInfo',
    'smartbanner',
    'qrScanner',
    'adScanner',
    'ccScanner',
    'filterLiveSuggest',
    'scrollTop',
    'openDeepLink',
    'openUniversalLink',
    'openDeferredDeepLink',
    'openSmartAppDownloadLink',
    'openPushNotification',
    'appReviewPrompt',
    'loginSuccess',
    'loginFailed',
  ];

  /**
   * Load legacy dependencies
   * and prepare coming tests
   */
  beforeAll(() => {
    // Set globals for legacy code
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get: () => storageMock(),
    });
  });

  /**
   * Before running a test clean up globals
   */
  beforeEach(() => {
    jest.resetModules();
    // Reinitialize to provide a clean core for each test
    SgTrackingCore = require('../core/Core').default.reset().registerFinished();

    // Provide clean local storage
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get: () => storageMock(),
    });
  });

  /**
   * Makes sure that all events that can be called are also registerable
   */
  it('should compare trackable and registerable events', () => {
    const registerableEventsFromCore = Object.keys(SgTrackingCore.register);
    const trackableEventsFromCore = Object.keys(SgTrackingCore.track);

    const comparable = [...trackableEventsFromCore, 'addTracker', 'removeTracker'];

    // Compare as sets (order-agnostic)
    expect(registerableEventsFromCore.sort()).toEqual(comparable.sort());
  });

  it('should make the core globally available in the window object', () => {
    expect(window.SgTrackingCore).toBe(SgTrackingCore);
  });

  /**
   * Simple tests against the pub/sub system.
   *
   * Foreach event
   *  1. registers for the event
   *  2. triggers the event
   *  3. checks that registered callback was called with given test data
   */
  it('should handle basic pub/sub functionality', () => {
    const spies = [];
    const options = { trackerName: 'mock' };
    const expectedObject = { expected: 'data' };

    // initial call as in original test
    SgTrackingCore.track.pageview();

    trackableEvents.forEach((event) => {
      const spy = jest.fn();
      spies.push(spy);

      // Subscribe and publish an event
      const sub = SgTrackingCore.register[event](spy, options);
      const that = SgTrackingCore.track[event](expectedObject);

      // Unsubscribe and publish an event
      sub.remove();
      SgTrackingCore.track[event](expectedObject);

      // Core should be returned to allow chaining
      expect(that).toBe(SgTrackingCore);

      // Check parameters
      expect(spy).toHaveBeenCalledWith(expectedObject, expect.any(Object), undefined, undefined);
      // Make sure core is cloning the data instead of passing the original reference
      expect(spy.mock.calls[0][0]).not.toBe(expectedObject);
    });

    // Make sure there have been no duplicated calls
    spies.forEach((spy) => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * Makes sure that core is adding the blacklist to the unified event handler
   */
  it('should test whitelist/blacklist filtering', () => {
    const unifiedTracker = {
      trackerName: 'unified',
    };

    const customTracker = {
      trackerName: 'mock',
      options: {
        useNativeSdk: true,
      },
    };

    const customTracker2 = {
      trackerName: 'mock2',
      options: {
        useNativeSdk: false,
      },
    };

    trackableEvents.forEach((event) => {
      const customSpy = jest.fn();
      const customSpy2 = jest.fn();
      const unifiedSpy = jest.fn();

      SgTrackingCore.register[event](unifiedSpy, unifiedTracker);
      SgTrackingCore.register[event](customSpy, customTracker);
      SgTrackingCore.register[event](customSpy2, customTracker2);

      SgTrackingCore.track[event](sgData);

      expect(unifiedSpy.mock.calls[0][0]).toEqual(sgData);
      expect(unifiedSpy.mock.calls[0][1]).toEqual({
        shopgate: true,
        merchant: true,
      });
      expect(unifiedSpy.mock.calls[0][2]).toEqual(['mock']);

      expect(customSpy.mock.calls[0][0]).toEqual(sgData);
      expect(customSpy2.mock.calls[0][0]).toEqual(sgData);
    });
  });

  /**
   * 1. activates optin
   * 2. checks that removeTracker is called
   * 3. deactivates optin
   * 4. check thats addTracker is called
   */
  it('should test that opt out triggers add/remove tracker events', () => {
    const options = {
      trackerName: 'mock',
    };

    // Create and prepare spies
    const spyAdd = jest.fn();
    const spyRemove = jest.fn();

    SgTrackingCore.register.addTracker(spyAdd, options);
    SgTrackingCore.register.removeTracker(spyRemove, options);

    // Activates opt out
    SgTrackingCore.optOut(true);
    expect(spyAdd).not.toHaveBeenCalled();
    expect(spyRemove).toHaveBeenCalled();

    // Reset spies
    spyAdd.mockClear();
    spyRemove.mockClear();

    // Deactivates opt out
    SgTrackingCore.optOut(false);
    expect(spyAdd).toHaveBeenCalledTimes(1);
    expect(spyRemove).not.toHaveBeenCalled();
  });

  /**
   * 1. Registers for an merchant only event
   * 2. Checks that shopgate events are not triggering it
   * 3. Register for an shopgate only event
   * 4. Checks that merchant events are not triggering it
   * 5. Checks that listener for both is called in both cases
   */
  it('should test merchant/shopgate account restrictions', () => {
    trackableEvents.forEach((event) => {
      // Create spies
      const spyAll = jest.fn();
      const spyShopgateEvent = jest.fn();
      const spyMerchantEvent = jest.fn();

      // Register spies
      SgTrackingCore.register[event](spyAll, { trackerName: 'mock' });
      SgTrackingCore.register[event](spyShopgateEvent, {
        trackerName: 'mock',
        merchant: false,
      });
      SgTrackingCore.register[event](spyMerchantEvent, {
        trackerName: 'mock',
        shopgate: false,
      });

      // Trigger events
      SgTrackingCore.track[event]({}, null, {
        shopgate: true,
        merchant: false,
      });
      SgTrackingCore.track[event]({}, null, {
        shopgate: false,
        merchant: true,
      });

      // Take assertions
      expect(spyAll).toHaveBeenCalledTimes(2);
      expect(spyShopgateEvent).toHaveBeenCalledTimes(1);
      expect(spyMerchantEvent).toHaveBeenCalledTimes(1);
    });
  });

  it('should test page scope restrictions', () => {
    trackableEvents.forEach((event) => {
      // Create spies
      const spyAll = jest.fn();
      const spyIndex = jest.fn();
      const spyCart = jest.fn();

      // Register spies
      SgTrackingCore.register[event](spyAll, { trackerName: 'mock' });
      SgTrackingCore.register[event](spyIndex, {
        trackerName: 'mock',
        page: 'index',
      });
      SgTrackingCore.register[event](spyCart, {
        trackerName: 'mock',
        page: 'cart',
      });

      // Track for index
      SgTrackingCore.track[event]({}, 'index');
      expect(spyIndex).toHaveBeenCalledTimes(1);
      expect(spyCart).not.toHaveBeenCalled();
      expect(spyAll).toHaveBeenCalledTimes(1);
      spyIndex.mockClear();

      // Track for cart
      SgTrackingCore.track[event]({}, 'cart');
      expect(spyIndex).not.toHaveBeenCalled();
      expect(spyCart).toHaveBeenCalled();
      expect(spyAll).toHaveBeenCalledTimes(2);
    });
  });

  /**
   * Mocks econda, ga universal and ga classic to test cross domain functionality
   */
  it('should test cross domain tracking', () => {
    // Set global test data
    window.sgData = sgData;

    // Add some econda params
    window.getEmosCrossUrlParams = () => 'emos_mock=1122';

    // "on ready" callback can be called immediately
    window.ga = fn => typeof fn === 'function' && fn();

    // Get tracker by name is not required for this test
    window.ga.getByName = () => {};

    /**
     * Mock Linker class for testing cross domain tracking
     */
    class Linker {
      /**
       * Decorates a URL with Google Analytics tracking parameters
       * @param {string} url - The URL to decorate
       * @returns {string} The decorated URL with GA parameters
       */
      decorate(url) {
        return `${url}&_ga=1.199239214.1624002396.1440697407`;
      }
    }
    window.gaplugins = { Linker };

    const expectedUrl =
      'http://testshop.reichhorn.localdev.cc/php/shopgate/index?emos_mock=1122&_ga=1.199239214.1624002396.1440697407';

    // Create ga classic spy to check called objects
    // eslint-disable-next-line no-underscore-dangle
    window._gaq = {};
    const gaqPush = jest.fn();
    // eslint-disable-next-line no-underscore-dangle
    window._gaq.push = gaqPush;

    // Execute cross domain tracking logic
    SgTrackingCore.crossDomainTracking('http://testshop.reichhorn.localdev.cc/php/shopgate/index');
    expect(gaqPush).toHaveBeenCalledTimes(1);
    expect(gaqPush.mock.calls[0][0][0]).toBe('merchant_._link');
    expect(gaqPush.mock.calls[0][0][1]).toBe(expectedUrl);

    const element = document.createElement('form');
    element.action = 'http://shopgate.com';

    // eslint-disable-next-line no-underscore-dangle
    window._gaq.push = jest.fn();
    // eslint-disable-next-line no-underscore-dangle
    const gaqPush2 = window._gaq.push;

    SgTrackingCore.crossDomainTracking(
      'http://testshop.reichhorn.localdev.cc/php/shopgate/index',
      element
    );

    expect(gaqPush2).toHaveBeenCalledTimes(1);
    expect(gaqPush2.mock.calls[0][0][0]).toBe('merchant_._linkByPost');
    expect(gaqPush2.mock.calls[0][0][1]).toBe(element);

    // without classic sdk
    // eslint-disable-next-line no-underscore-dangle
    window._gaq = undefined;

    SgTrackingCore.crossDomainTracking(
      'http://testshop.reichhorn.localdev.cc/php/shopgate/index',
      element
    );
    expect(element.action).toBe(expectedUrl);

    // Redefine window.location as it is simulated using jsdom
    // Otherwise the location.href can't be changed
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });

    SgTrackingCore.crossDomainTracking('http://testshop.reichhorn.localdev.cc/php/shopgate/index');
    expect(window.location.href).toBe(expectedUrl);
  });

  it('should test buildAdImageIdentifierName', () => {
    const withTitle = SgTrackingCore.buildAdImageIdentifierName('Title', 123);
    expect(withTitle).toBe('Title (id: 123)');

    const withoutTitle = SgTrackingCore.buildAdImageIdentifierName(undefined, 123);
    expect(withoutTitle).toBe('(id: 123)');
  });

  it('should test isOptOut()', () => {
    expect(SgTrackingCore.isOptOut()).toBe(false);
    SgTrackingCore.optOut(true);
    expect(SgTrackingCore.isOptOut()).toBe(true);
    SgTrackingCore.optOut(false);
    expect(SgTrackingCore.isOptOut()).toBe(false);
  });

  it('should test getScannerEvents()', () => {
    const expected = {
      SCAN_ACTIVATED: 'scan_activated',
      SCAN_STARTED: 'scan_started',
      SCAN_CANCELED: 'scan_canceled',
      SCAN_SUCCESS: 'scan_success',
      SCAN_FAIL: 'scan_fail',
      SCAN_USER_LINK_INTERACTION: 'scan_user_link_interaction',
    };

    expect(SgTrackingCore.getScannerEvents()).toEqual(expected);
  });
});
