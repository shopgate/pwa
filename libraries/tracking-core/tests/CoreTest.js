/* eslint global-require: "off" */
/* eslint no-unused-expressions: "off" */
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import mochaJsdom from 'mocha-jsdom';
import storageMock from './helpers/localStorage-mock';
import { sgData } from './data/tracking.testData';

const { expect } = chai;

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

  // Initializes fake DOM
  mochaJsdom();

  // Initializes sinon to be used with chai
  chai.use(sinonChai);

  /**
   * Load legacy dependencies
   * and prepare coming tests
   */
  before(() => {
    // Set globals for legacy code
    global.localStorage = storageMock();
  });

  /**
   * Before running a test clean up globals
   */
  beforeEach(() => {
    // Reinitialize to provide a clean core for each test
    SgTrackingCore = require('../core/Core').default.reset().registerFinished();

    // Provide clean local storage
    global.localStorage = storageMock();
  });

  /**
   * Makes sure that all events that can be called are also registerable
   */
  it('should compare trackable and registerable events', () => {
    const registerableEventsFromCore = [];
    const trackableEventsFromCore = [];

    registerableEventsFromCore.push(...Object.keys(SgTrackingCore.register));
    trackableEventsFromCore.push(...Object.keys(SgTrackingCore.track));

    const comparable = [...trackableEventsFromCore, 'addTracker', 'removeTracker'];
    expect(registerableEventsFromCore).to.have.members(comparable);
  });

  it('should make the core globally available in the window object', () => {
    expect(window.SgTrackingCore).to.be.equal(SgTrackingCore);
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
    const options = {
      trackerName: 'mock',
    };
    const expectedObject = { expected: 'data' };

    SgTrackingCore.track.pageview();

    trackableEvents.forEach((event) => {
      const spy = sinon.spy();
      spies.push(spy);

      // Subscribe and publish an event
      const sub = SgTrackingCore.register[event](spy, options);
      const that = SgTrackingCore.track[event](expectedObject);

      // Unsubscribe and publish an event
      sub.remove();
      SgTrackingCore.track[event](expectedObject);

      // Core should be returned to allow chaining
      expect(that).to.equal(SgTrackingCore);

      // Check parameters
      expect(spy).to.have.been.calledWith(expectedObject);
      // Make sure core is cloning the data instead of passing the original reference
      expect(spy.getCall(0).args[0]).to.not.equal(expectedObject);
    });

    // Make sure there have been no duplicated calls
    spies.forEach((spy) => {
      expect(spy).to.have.been.calledOnce;
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
      const customSpy = sinon.spy();
      const customSpy2 = sinon.spy();
      const unifiedSpy = sinon.spy();

      SgTrackingCore.register[event](unifiedSpy, unifiedTracker);
      SgTrackingCore.register[event](customSpy, customTracker);
      SgTrackingCore.register[event](customSpy2, customTracker2);

      SgTrackingCore.track[event](sgData);

      expect(unifiedSpy).to.have.been.calledWith(
        sgData,
        {
          shopgate: true,
          merchant: true,
        },
        ['mock']
      );

      expect(customSpy).to.have.been.calledWith(sgData);
      expect(customSpy2).to.have.been.calledWith(sgData);
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
    const spyAdd = sinon.spy();
    const spyRemove = sinon.spy();

    SgTrackingCore.register.addTracker(spyAdd, options);
    SgTrackingCore.register.removeTracker(spyRemove, options);

    // Activates opt out
    SgTrackingCore.optOut(true);
    expect(spyAdd).to.not.have.been.calledOnce.to.not.throw();
    expect(spyRemove).to.have.been.called.to.not.throw();

    // Reset spies
    spyAdd.reset();
    spyRemove.reset();

    // Deactivates opt out
    SgTrackingCore.optOut(false);
    expect(spyAdd).to.have.been.calledOnce.to.not.throw();
    expect(spyRemove).to.not.have.been.called.to.not.throw();
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
      const spyAll = sinon.spy();
      const spyShopgateEvent = sinon.spy();
      const spyMerchantEvent = sinon.spy();

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
      expect(spyAll).to.have.been.calledTwice.to.not.throw();
      expect(spyShopgateEvent).to.have.been.calledOnce.to.not.throw();
      expect(spyMerchantEvent).to.have.been.calledOnce.to.not.throw();
    });
  });

  it('should test page scope restrictions', () => {
    trackableEvents.forEach((event) => {
      // Create spies
      const spyAll = sinon.spy();
      const spyIndex = sinon.spy();
      const spyCart = sinon.spy();

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
      expect(spyIndex).to.have.been.calledOnce;
      expect(spyCart).to.not.have.been.called;
      expect(spyAll).to.have.been.calledOnce;
      spyIndex.reset();

      // Track for cart
      SgTrackingCore.track[event]({}, 'cart');
      expect(spyIndex).to.not.have.been.calledOnce;
      expect(spyCart).to.have.been.called;
      expect(spyAll).to.have.been.calledTwice;
    });
  });

  /**
   * Mocks econda, ga universal and ga classic to test cross domain functionality
   */
  it('should test cross domain tracking', () => {
    // Set global test data
    global.window.sgData = sgData;

    // Add some econda params
    global.window.getEmosCrossUrlParams = () => 'emos_mock=1122';

    // "on ready" callback can be called immediately
    global.window.ga = fn => fn();

    // Get tracker by name is not required for this test
    global.window.ga.getByName = () => { };

    // Add some google universal parameters
    global.window.gaplugins = {
      Linker() {
        return {
          decorate(url) {
            return `${url}&_ga=1.199239214.1624002396.1440697407`;
          },
        };
      },
    };

    const expectedUrl = 'http://testshop.reichhorn.localdev.cc/php/shopgate/index?emos_mock=1122&_ga=1.199239214.1624002396.1440697407';

    // Create ga classic spy to check called objects
    /* eslint-disable no-underscore-dangle, no-multi-assign */
    global._gaq = global.window._gaq = {};
    let gaqPush = global._gaq.push = sinon.spy();
    /* eslint-enable no-underscore-dangle, no-multi-assign */

    // Execute cross domain tracking logic
    SgTrackingCore.crossDomainTracking('http://testshop.reichhorn.localdev.cc/php/shopgate/index');

    // Check _gaq calls
    expect(gaqPush).to.have.been.calledOnce.to.not.throw();
    expect(gaqPush.getCall(0).args[0][0]).to.equal('merchant_._link');
    expect(gaqPush.getCall(0).args[0][1]).to.equal(expectedUrl);

    // Execute cross domain tracking logic with form element
    /* eslint-disable no-underscore-dangle, no-multi-assign */
    gaqPush = global._gaq.push = sinon.spy();
    /* eslint-enable no-underscore-dangle, no-multi-assign */

    const element = document.createElement('form');
    element.action = 'http://shopgate.com';

    SgTrackingCore.crossDomainTracking(
      'http://testshop.reichhorn.localdev.cc/php/shopgate/index',
      element
    );

    expect(gaqPush).to.have.been.calledOnce.to.not.throw();
    expect(gaqPush.getCall(0).args[0][0]).to.equal('merchant_._linkByPost');
    expect(gaqPush.getCall(0).args[0][1]).to.equal(element);

    // Execute cross domain tracking logic with form and without classic sdk
    /* eslint-disable no-underscore-dangle */
    global._gaq = undefined;
    /* eslint-enable no-underscore-dangle */

    SgTrackingCore.crossDomainTracking(
      'http://testshop.reichhorn.localdev.cc/php/shopgate/index',
      element
    );

    expect(element.action).to.equal(expectedUrl);

    // Redefine window.location as it is simulated using jsdom
    // Otherwise the location.href can't be changed
    Object.defineProperty(global.window, 'location', {
      writable: true,
      value: { href: '' },
    });

    // Execute cross domain tracking without ga sdk and without element
    SgTrackingCore.crossDomainTracking('http://testshop.reichhorn.localdev.cc/php/shopgate/index');

    expect(global.window.location.href).to.equal(expectedUrl);
  });

  it('should test buildAdImageIdentifierName', () => {
    const withTitle = SgTrackingCore.buildAdImageIdentifierName('Title', 123);
    expect(withTitle).to.equal('Title (id: 123)');

    const withoutTitle = SgTrackingCore.buildAdImageIdentifierName(undefined, 123);
    expect(withoutTitle).to.equal('(id: 123)');
  });

  it('should test isOptOut()', () => {
    expect(SgTrackingCore.isOptOut()).to.be.false;
    SgTrackingCore.optOut(true);
    expect(SgTrackingCore.isOptOut()).to.be.true;
    SgTrackingCore.optOut(false);
    expect(SgTrackingCore.isOptOut()).to.be.false;
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

    expect(SgTrackingCore.getScannerEvents()).to.deep.equal(expected);
  });
});

