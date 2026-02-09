/** @jest-environment jsdom */

/* eslint global-require: "off" */
import storageMock from './helpers/localStorage-mock';
import { sgDataOrder } from './data/tracking.testData';
import { gaOrderData } from './data/tracking.expectedData';

describe('GaBase (Jest 28)', () => {
  const events = ['pageview', 'addToCart', 'purchase'];

  const customEvents = {
    smartbanner: ['Smartbanner', true],
    scrollTop: ['ScrollTop', false],
    qrScanner: ['QRScanner', true],
    adScanner: ['AdScanner', true],
    ccScanner: ['CcScanner', true],
    appReviewPrompt: ['AppReviewPrompt', false],
    filterLiveSuggest: ['FilterLiveSuggest', false],
    openDeepLink: ['DeepLinkOpen', false],
    openUniversalLink: ['UniversalLinkOpen', false],
    openDeferredDeepLink: ['DeferredDeepLinkOpen', false],
    openSmartAppDownloadLink: ['SmartAppDownloadLink', false],
    openPushNotification: ['PushNotification', false],
  };

  const eventCallbacks = {};

  let SgTrackingGAPlugin = null;
  let SgTrackingCore = null;
  let gaSpy = null;
  let gaqSpy = null;

  beforeAll(() => {
    // jsdom skeleton + placeholder script so insertBefore works
    document.documentElement.innerHTML = '<!doctype html><html><head></head><body></body></html>';
    document.head.appendChild(document.createElement('script'));

    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get: () => storageMock(),
    });

    window.sgData = sgDataOrder;
    window.sgData.device.access = 'App';
    window.sgData.device.codebase = '1.2.3';

    global.Headers = jest.fn();
    console.groupCollapsed = jest.fn();
    console.groupEnd = jest.fn();
    window.SGEvent = {};

    jest.resetModules();
    SgTrackingCore = require('../core/Core').default.reset();
  });

  beforeEach(() => {
    // fresh DOM scripts order each test
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    document.head.appendChild(document.createElement('script'));

    // reset core state
    SgTrackingCore.reset();

    jest.resetModules();
    // eslint-disable-next-line import/extensions
    SgTrackingGAPlugin = require('../plugins/trackers/GaBase.js').default;

    gaSpy = jest.fn();
    window.ga = gaSpy;
    global.ga = gaSpy;

    // capture register callbacks
    [...events, ...Object.keys(customEvents)].forEach((event) => {
      SgTrackingCore.register[event] = (cb) => {
        eventCallbacks[event] = cb;
      };
    });

    // create Universal
    SgTrackingGAPlugin.createUniversal({
      config: {
        merchant: [{ id: 'merchant1' }, { id: 'merchant2' }],
        shopgate: { id: 'shopgate' },
      },
    });

    // classic GA (_gaq)
    gaqSpy = jest.fn();
    // eslint-disable-next-line no-underscore-dangle
    global._gaq = { push: gaqSpy };
    // eslint-disable-next-line no-underscore-dangle
    window._gaq = global._gaq;

    // create Classic
    SgTrackingGAPlugin.createClassic({
      config: {
        merchant: [{ id: 'merchant1' }, { id: 'merchant2' }],
      },
    });
  });

  it('should test that classic sdk is initialized correctly', () => {
    const scripts = Array.from(document.getElementsByTagName('script'));
    const hasClassic = scripts.some(s => (s.src || '').includes('google-analytics.com/ga'));
    expect(hasClassic).toBe(true);

    expect(gaqSpy).toHaveBeenCalledTimes(3);

    const c0 = gaqSpy.mock.calls[0];
    const c1 = gaqSpy.mock.calls[1];
    const c2 = gaqSpy.mock.calls[2];

    expect(c0[0]).toEqual(['merchant_._setAccount', 'merchant1']);
    expect(c0[1]).toEqual(['merchant_._setAllowLinker', true]);

    expect(c1[0]).toEqual(['merchant_merchant2._setAccount', 'merchant2']);
    expect(c1[0]).toEqual(['merchant_merchant2._setAccount', 'merchant2']);

    expect(c2[0]).toEqual(['_gat._anonymizeIp', true]);
    expect(c2[1]).toEqual(['_gat._forceSSL', true]);
  });

  it('should test that universal sdk is initialized correctly', () => {
    const scripts = Array.from(document.getElementsByTagName('script'));
    const hasUniversal = scripts.some(s => (s.src || '').includes('google-analytics.com/analytics'));
    expect(hasUniversal).toBe(true);

    expect(gaSpy).toHaveBeenCalledTimes(11);

    expect(gaSpy.mock.calls[0]).toEqual(['create', {
      trackingId: 'merchant1',
      cookieDomain: 'auto',
      name: 'merchant_merchant1',
      allowLinker: true,
    }]);
    expect(gaSpy.mock.calls[1]).toEqual(['merchant_merchant1.set', 'anonymizeIp', true]);
    expect(gaSpy.mock.calls[2]).toEqual(['merchant_merchant1.set', 'forceSSL', true]);

    expect(gaSpy.mock.calls[3]).toEqual(['create', {
      trackingId: 'merchant2',
      cookieDomain: 'auto',
      name: 'merchant_merchant2',
      allowLinker: true,
    }]);
    expect(gaSpy.mock.calls[4]).toEqual(['merchant_merchant2.set', 'anonymizeIp', true]);
    expect(gaSpy.mock.calls[5]).toEqual(['merchant_merchant2.set', 'forceSSL', true]);

    expect(gaSpy.mock.calls[6]).toEqual(['create', {
      trackingId: 'shopgate',
      cookieDomain: 'auto',
      name: 'shopgate',
      allowLinker: true,
    }]);
    expect(gaSpy.mock.calls[7]).toEqual(['shopgate.set', 'anonymizeIp', true]);
    expect(gaSpy.mock.calls[8]).toEqual(['shopgate.set', 'forceSSL', true]);
    expect(gaSpy.mock.calls[9]).toEqual(['shopgate.set', 'dimension1', '10006']);
    expect(gaSpy.mock.calls[10]).toEqual(['shopgate.set', 'dimension2', '1.2.3']);
  });

  /**
   * Helper functions that allows to test a specific event and asserts correct sdk calls
   *
   * @param {string} eventName name of the event
   * @param {Object} data data that is passed to the event
   * @param {Object} expectedUniversal expected arguments for universal sdk
   * @param {Object} expectedClassic expected arguments for classic sdk
   * @param {boolean} merchant if merchants should receive the event
   * @private
   */
  function testEventData(eventName, data, expectedUniversal, expectedClassic, merchant = true) {
    const gaCalls = gaSpy.mock.calls.length;
    const gaqCalls = gaqSpy.mock.calls.length;

    eventCallbacks[eventName](data, {
      merchant: true,
      shopgate: true,
      trackerName: 'mock',
    });

    expect(gaSpy).toHaveBeenCalledTimes(merchant ? gaCalls + 3 : gaCalls + 1);

    if (merchant) {
      expect(gaSpy.mock.calls[gaCalls]).toEqual(['merchant_merchant1.send', ...expectedUniversal]);
      expect(gaSpy.mock.calls[gaCalls + 1]).toEqual(['merchant_merchant2.send', ...expectedUniversal]);
    }
    expect(gaSpy.mock.calls[merchant ? gaCalls + 2 : gaCalls]).toEqual(['shopgate.send', ...expectedUniversal]);

    if (merchant) {
      expect(gaqSpy).toHaveBeenCalledTimes(gaqCalls + 2);
      expect(gaqSpy.mock.calls[gaqCalls]).toEqual([[`merchant_.${expectedClassic[0]}`, ...expectedClassic.slice(1)]]);
      expect(gaqSpy.mock.calls[gaqCalls + 1]).toEqual([[`merchant_merchant2.${expectedClassic[0]}`, ...expectedClassic.slice(1)]]);
    }
  }

  /**
   * Helper function to create data for custom events
   *
   * @param {string} eventCategory event name
   * @param {string} eventAction action name
   * @param {string} eventLabel label
   * @param {Object} eventValue value / data
   * @param {boolean} nonInteraction cause of the event (user: true)
   * @returns {{universal: *[], classic: *[]}}
   */
  function createCustomEventData(
    eventCategory,
    eventAction,
    eventLabel,
    eventValue,
    nonInteraction
  ) {
    return {
      universal: ['event', {
        eventCategory,
        eventAction,
        eventLabel,
        eventValue,
        nonInteraction,
      }],
      classic: [
        '_trackEvent',
        eventCategory,
        eventAction,
        eventLabel,
        eventValue,
        nonInteraction,
      ],
    };
  }

  it('should test sdk calls for addToCart event', () => {
    testEventData(
      'addToCart',
      window.sgData,
      ['pageview', 'add_to_cart'],
      ['_trackPageview', 'add_to_cart']
    );
  });

  it('should test sdk calls for custom events', () => {
    Object.keys(customEvents).forEach((eventName) => {
      const data = createCustomEventData(
        customEvents[eventName][0],
        'action',
        'label',
        'value',
        false
      );

      testEventData(
        eventName,
        data.universal[1],
        data.universal,
        data.classic,
        customEvents[eventName][1]
      );
    });
  });

  it('should test universal sdk calls for the purchase event', () => {
    const start = gaSpy.mock.calls.length;

    const transactionData = gaOrderData.universal.order;
    const itemData = gaOrderData.universal.items;

    eventCallbacks.purchase(window.sgData);

    expect(gaSpy).toHaveBeenCalledTimes(start + 15);

    expect(gaSpy.mock.calls[start]).toEqual(['merchant_merchant1.require', 'ecommerce', 'ecommerce.js']);
    expect(gaSpy.mock.calls[start + 1]).toEqual(['merchant_merchant2.require', 'ecommerce', 'ecommerce.js']);
    expect(gaSpy.mock.calls[start + 2]).toEqual(['shopgate.require', 'ecommerce', 'ecommerce.js']);

    expect(gaSpy.mock.calls[start + 3]).toEqual(['merchant_merchant1.ecommerce:addTransaction', transactionData]);
    expect(gaSpy.mock.calls[start + 4]).toEqual(['merchant_merchant2.ecommerce:addTransaction', transactionData]);
    expect(gaSpy.mock.calls[start + 5]).toEqual(['shopgate.ecommerce:addTransaction', transactionData]);

    expect(gaSpy.mock.calls[start + 6]).toEqual(['merchant_merchant1.ecommerce:addItem', itemData[0]]);
    expect(gaSpy.mock.calls[start + 7]).toEqual(['merchant_merchant2.ecommerce:addItem', itemData[0]]);
    expect(gaSpy.mock.calls[start + 8]).toEqual(['shopgate.ecommerce:addItem', itemData[0]]);

    expect(gaSpy.mock.calls[start + 9]).toEqual(['merchant_merchant1.ecommerce:addItem', itemData[1]]);
    expect(gaSpy.mock.calls[start + 10]).toEqual(['merchant_merchant2.ecommerce:addItem', itemData[1]]);
    expect(gaSpy.mock.calls[start + 11]).toEqual(['shopgate.ecommerce:addItem', itemData[1]]);

    expect(gaSpy.mock.calls[start + 12]).toEqual(['merchant_merchant1.ecommerce:send']);
    expect(gaSpy.mock.calls[start + 13]).toEqual(['merchant_merchant2.ecommerce:send']);
    expect(gaSpy.mock.calls[start + 14]).toEqual(['shopgate.ecommerce:send']);
  });

  it('should test classic sdk calls for the purchase event', () => {
    const transactionData = gaOrderData.classic.order;
    const itemData = gaOrderData.classic.items;

    const base = gaqSpy.mock.calls.length;

    eventCallbacks.purchase(window.sgData);

    expect(gaqSpy).toHaveBeenCalledTimes(base + 10);

    expect(gaqSpy.mock.calls[base]).toEqual([['merchant_._addTrans', ...transactionData]]);
    expect(gaqSpy.mock.calls[base + 1]).toEqual([['merchant_merchant2._addTrans', ...transactionData]]);

    expect(gaqSpy.mock.calls[base + 2]).toEqual([['merchant_._addItem', ...itemData[0]]]);
    expect(gaqSpy.mock.calls[base + 3]).toEqual([['merchant_merchant2._addItem', ...itemData[0]]]);

    expect(gaqSpy.mock.calls[base + 4]).toEqual([['merchant_._addItem', ...itemData[1]]]);
    expect(gaqSpy.mock.calls[base + 5]).toEqual([['merchant_merchant2._addItem', ...itemData[1]]]);

    // Code change from https://github.com/shopgate/pwa/commit/3d0edfb6cb4da5c8fd236de1b7e76d372f8fa626
    // caused these two calls to change to _undefined instead of _set
    expect(gaqSpy.mock.calls[base + 6]).toEqual([['merchant_._undefined', 'currencyCode', 'EUR']]);
    expect(gaqSpy.mock.calls[base + 7]).toEqual([['merchant_merchant2._undefined', 'currencyCode', 'EUR']]);

    expect(gaqSpy.mock.calls[base + 8]).toEqual([['merchant_._trackTrans', undefined]]);
    expect(gaqSpy.mock.calls[base + 9]).toEqual([['merchant_merchant2._trackTrans', undefined]]);
  });

  afterAll(() => {
    SgTrackingCore = undefined;
  });
});
