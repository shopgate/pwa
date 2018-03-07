/*
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import chai from 'chai';
import sinon from 'sinon';
import chaiSinon from 'sinon-chai';
import mochaJsdom from 'mocha-jsdom';
import storageMock from './helpers/localStorage-mock';
import { sgDataOrder } from './data/tracking.testData';
import { gaOrderData } from './data/tracking.expectedData';

const expect = chai.expect;
const rerequire = mochaJsdom.rerequire;

describe('GaBase', () => {
  chai.use(chaiSinon);

  mochaJsdom();

  // Events for ga
  const events = [
    'pageview',
    'addToCart',
    'purchase',
  ];

  // Custom events
  // Maps unified name to ga name and if merchant account is expected to recieve these events
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
  let gaqSpy = null;
  let gaSpy = null;

  before(() => {
    // Set globals for legacy code
    global.window.sgData = sgDataOrder;
    global.window.sgData.device.access = 'App';
    global.window.sgData.device.codebase = '1.2.3';
    global.localStorage = storageMock();
    window.SGEvent = {};

    SgTrackingCore = require('../core/Core').default.reset();
  });

  beforeEach(() => {
    // Reset the core
    SgTrackingCore.reset();

    // After globals are set scripts can be imported
    SgTrackingGAPlugin = rerequire('../plugins/trackers/GaBase.js').default;

    // Set dom content
    document.body.innerHTML = `
      <head>
        <!-- Parent node for ga-->
        <script></script>
      </head>

      <body>
      </body>`;

    // Spy on universal sdk
    gaSpy = sinon.spy();
    global.window.ga = gaSpy;
    global.ga = gaSpy;

      // Save all registered callbacks for events
    [...events, ...Object.keys(customEvents)].forEach((event) => {
      SgTrackingCore.register[event] = (cb) => {
        eventCallbacks[event] = cb;
      };
    });

    // Initiate universal
    SgTrackingGAPlugin.createUniversal({
      config: {
        merchant: [
          {
            id: 'merchant1',
          },
          {
            id: 'merchant2',
          },
        ],
        shopgate: {
          id: 'shopgate',
        },
      },
    });

    // Spy on ga classic
    gaqSpy = sinon.spy();
    // eslint-disable-next-line no-underscore-dangle
    global._gaq = {
      push: gaqSpy,
    };
    global.window._gaq = global._gaq;

      // Check classic
    SgTrackingGAPlugin.createClassic({
      config: {
        merchant: [
          {
            id: 'merchant1',
          },
          {
            id: 'merchant2',
          },
        ],
      },
    });
  });

  it('should test that classic sdk is initialized correctly', () => {
    // Make sure dom script element has been created
    expect(document.getElementsByTagName('script')[0].src.indexOf('google-analytics.com/ga')).to.not.equal(-1);

    // Make sure that gaq has been called correctly
    expect(gaqSpy).to.have.callCount(3);
    expect(gaqSpy.getCall(0).args[0]).to.deep.equal(['merchant_._setAccount', 'merchant1']);
    expect(gaqSpy.getCall(0).args[1]).to.deep.equal(['merchant_._setAllowLinker', true]);

    expect(gaqSpy.getCall(1).args[0]).to.deep.equal(['merchant_merchant2._setAccount', 'merchant2']);
    expect(gaqSpy.getCall(1).args[0]).to.deep.equal(['merchant_merchant2._setAccount', 'merchant2']);

    expect(gaqSpy.getCall(2).args[0]).to.deep.equal(['_gat._anonymizeIp', true]);
    expect(gaqSpy.getCall(2).args[1]).to.deep.equal(['_gat._forceSSL', true]);
  });

  it('should test that universal sdk is initialized correctly', () => {
    // Make sure dom script element has been created
    expect(document.getElementsByTagName('script')[1].src.indexOf('google-analytics.com/analytics')).to.not.equal(-1);

    // Make sure that ga has been called correctly
    expect(gaSpy).to.have.callCount(11);
    expect(gaSpy.getCall(0).args).to.deep.equal(['create', {
      trackingId: 'merchant1',
      cookieDomain: 'auto',
      name: 'merchant_merchant1',
      allowLinker: true,
    }]);
    expect(gaSpy.getCall(1).args).to.deep.equal(['merchant_merchant1.set', 'anonymizeIp', true]);
    expect(gaSpy.getCall(2).args).to.deep.equal(['merchant_merchant1.set', 'forceSSL', true]);

    expect(gaSpy.getCall(3).args).to.deep.equal(['create', {
      trackingId: 'merchant2',
      cookieDomain: 'auto',
      name: 'merchant_merchant2',
      allowLinker: true,
    }]);
    expect(gaSpy.getCall(4).args).to.deep.equal(['merchant_merchant2.set', 'anonymizeIp', true]);
    expect(gaSpy.getCall(5).args).to.deep.equal(['merchant_merchant2.set', 'forceSSL', true]);

    expect(gaSpy.getCall(6).args).to.deep.equal(['create', {
      trackingId: 'shopgate',
      cookieDomain: 'auto',
      name: 'shopgate',
      allowLinker: true,
    }]);

    expect(gaSpy.getCall(7).args).to.deep.equal(['shopgate.set', 'anonymizeIp', true]);
    expect(gaSpy.getCall(8).args).to.deep.equal(['shopgate.set', 'forceSSL', true]);
    expect(gaSpy.getCall(9).args).to.deep.equal(['shopgate.set', 'dimension1', '10006']);
    expect(gaSpy.getCall(10).args).to.deep.equal(['shopgate.set', 'dimension2', '1.2.3']);
  });

  /**
   * Helper functions that allows to test a specific event and asserts correct sdk calls
   *
   * @param {string} eventName name of the event
   * @param {Object} data data that is passed to the event
   * @param {Object} expectedUniversal expected arguments for universal sdk
   * @param {Object} expectedClassic expected arguments for classic sdk
   * @param {bool} merchant if merchants should receive the event
   * @private
   */
  function testEventData(eventName, data, expectedUniversal, expectedClassic, merchant = true) {
    const gaCalls = gaSpy.getCalls().length;
    const gaqCalls = gaqSpy.getCalls().length;

    eventCallbacks[eventName](data, { merchant: true, shopgate: true, trackerName: 'mock' });

    expect(gaSpy).to.have.callCount(merchant ? gaCalls + 3 : gaCalls + 1);

    if (merchant) {
      // Merchant 1
      expect(gaSpy.getCall(gaCalls).args).to.deep.equal(['merchant_merchant1.send', ...expectedUniversal]);
      // Merchant 2
      expect(gaSpy.getCall(gaCalls + 1).args).to.deep.equal(['merchant_merchant2.send', ...expectedUniversal]);
    }

    // Shopgate
    expect(gaSpy.getCall(merchant ? gaCalls + 2 : gaCalls).args).to.deep.equal(['shopgate.send', ...expectedUniversal]);

    if (merchant) {
      expect(gaqSpy).to.have.callCount(gaqCalls + 2);
      expect(gaqSpy.getCall(gaqCalls).args).to.deep.equal([[`merchant_.${expectedClassic[0]}`, ...expectedClassic.slice(1)]]);
      expect(gaqSpy.getCall(gaqCalls + 1).args).to.deep.equal([[`merchant_merchant2.${expectedClassic[0]}`, ...expectedClassic.slice(1)]]);
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

      classic: ['_trackEvent',
        eventCategory,
        eventAction,
        eventLabel,
        eventValue,
        nonInteraction,
      ],
    };
  }

  it('should test sdk calls for addToCart event', () => {
    testEventData('addToCart', global.window.sgData,
      ['pageview', 'add_to_cart'],
      ['_trackPageview', 'add_to_cart']);
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
    const gaCalls = gaSpy.getCalls().length;

    const transactionData = gaOrderData.universal.order;
    const itemData = gaOrderData.universal.items;

    eventCallbacks.purchase(global.window.sgData);

    expect(gaSpy).to.have.callCount(gaCalls + 15);

    // Should require ecommerce plugin for all accounts
    expect(gaSpy.getCall(gaCalls).args).to.deep.equal(['merchant_merchant1.require', 'ecommerce', 'ecommerce.js']);
    expect(gaSpy.getCall(gaCalls + 1).args).to.deep.equal(['merchant_merchant2.require', 'ecommerce', 'ecommerce.js']);
    expect(gaSpy.getCall(gaCalls + 2).args).to.deep.equal(['shopgate.require', 'ecommerce', 'ecommerce.js']);

    // Should start a transaction on all accounts
    expect(gaSpy.getCall(gaCalls + 3).args).to.deep.equal(['merchant_merchant1.ecommerce:addTransaction', transactionData]);
    expect(gaSpy.getCall(gaCalls + 4).args).to.deep.equal(['merchant_merchant2.ecommerce:addTransaction', transactionData]);
    expect(gaSpy.getCall(gaCalls + 5).args).to.deep.equal(['shopgate.ecommerce:addTransaction', transactionData]);

    // Should add two items on all accounts
    expect(gaSpy.getCall(gaCalls + 6).args).to.deep.equal(['merchant_merchant1.ecommerce:addItem', itemData[0]]);
    expect(gaSpy.getCall(gaCalls + 7).args).to.deep.equal(['merchant_merchant2.ecommerce:addItem', itemData[0]]);
    expect(gaSpy.getCall(gaCalls + 8).args).to.deep.equal(['shopgate.ecommerce:addItem', itemData[0]]);

    expect(gaSpy.getCall(gaCalls + 9).args).to.deep.equal(['merchant_merchant1.ecommerce:addItem', itemData[1]]);
    expect(gaSpy.getCall(gaCalls + 10).args).to.deep.equal(['merchant_merchant2.ecommerce:addItem', itemData[1]]);
    expect(gaSpy.getCall(gaCalls + 11).args).to.deep.equal(['shopgate.ecommerce:addItem', itemData[1]]);

    // Should submit the transaction on all accounts
    expect(gaSpy.getCall(gaCalls + 12).args).to.deep.equal(['merchant_merchant1.ecommerce:send']);
    expect(gaSpy.getCall(gaCalls + 13).args).to.deep.equal(['merchant_merchant2.ecommerce:send']);
    expect(gaSpy.getCall(gaCalls + 14).args).to.deep.equal(['shopgate.ecommerce:send']);
  });

  it('should test classic sdk calls for the purchase event', () => {
    const transactionData = gaOrderData.classic.order;
    const itemData = gaOrderData.classic.items;

    const gaqCalls = gaqSpy.getCalls().length;
    eventCallbacks.purchase(global.window.sgData);

    expect(gaqSpy).to.have.callCount(gaqCalls + 10);

    // Should start transaction on all accounts
    expect(gaqSpy.getCall(gaqCalls).args).to.deep.equal([['merchant_._addTrans', ...transactionData]]);
    expect(gaqSpy.getCall(gaqCalls + 1).args).to.deep.equal([['merchant_merchant2._addTrans', ...transactionData]]);

    // Should add both producs on all accounts
    expect(gaqSpy.getCall(gaqCalls + 2).args).to.deep.equal([['merchant_._addItem', ...itemData[0]]]);
    expect(gaqSpy.getCall(gaqCalls + 3).args).to.deep.equal([['merchant_merchant2._addItem', ...itemData[0]]]);

    expect(gaqSpy.getCall(gaqCalls + 4).args).to.deep.equal([['merchant_._addItem', ...itemData[1]]]);
    expect(gaqSpy.getCall(gaqCalls + 5).args).to.deep.equal([['merchant_merchant2._addItem', ...itemData[1]]]);

    expect(gaqSpy.getCall(gaqCalls + 6).args).to.deep.equal([['merchant_._set', 'currencyCode', 'EUR']]);
    expect(gaqSpy.getCall(gaqCalls + 7).args).to.deep.equal([['merchant_merchant2._set', 'currencyCode', 'EUR']]);

    expect(gaqSpy.getCall(gaqCalls + 8).args).to.deep.equal([['merchant_._trackTrans', undefined]]);
    expect(gaqSpy.getCall(gaqCalls + 9).args).to.deep.equal([['merchant_merchant2._trackTrans', undefined]]);
  });

  after(() => {
    SgTrackingCore = undefined;
  });
});
