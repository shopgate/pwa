/** @jest-environment jsdom */

/* eslint global-require: "off" */

describe('AppHandler', () => {
  let appHandler;
  let SGAction;

  beforeAll(() => {
    // silence console groups during test
    global.console.groupCollapsed = jest.fn();
    global.console.groupEnd = jest.fn();

    // minimal globals the code expects
    global.window = global.window || {};
    window.SGEvent = {};

    // load modules after globals are set
    appHandler = require('../core/AppHandler').default;
    ({ SGAction } = require('../helpers/helper'));
  });

  /**
   * Restrictions object for all tests
   * @type {{blacklist: boolean, trackers: string[]}}
   */
  const restrictions = {
    blacklist: true,
    trackers: ['fb'],
  };

  /**
   * We can use dummy data here, because we only test the adding of the restrictions
   * @type {{foo: string, test: string}}
   */
  const dummyData = {
    foo: 'bar',
    test: 'test',
  };

  /**
   * Events that should be tested
   * @type {[{SGAction: String, event: String}]}
   */
  const events = [
    {
      SGAction: 'analyticsSetCampaignWithUrl',
      event: 'setCampaignWithUrl',
    },
    {
      SGAction: 'analyticsLogPageview',
      event: 'viewContent',
    },
    {
      SGAction: 'analyticsLogPurchase',
      event: 'purchase',
    },
    {
      SGAction: 'analyticsLogAddToCart',
      event: 'addToCart',
    },
    {
      SGAction: 'analyticsLogAddedPaymentInfo',
      event: 'addedPaymentInfo',
    },
    {
      SGAction: 'analyticsLogInitiatedCheckout',
      event: 'initiatedCheckout',
    },
    {
      SGAction: 'analyticsLogCompletedRegistration',
      event: 'completedRegistration',
    },
    {
      SGAction: 'analyticsLogAddToWishlist',
      event: 'addToWishlist',
    },
    {
      SGAction: 'analyticsLogSearch',
      event: 'search',
    },
  ];

  /**
   * Helper: create a spy for a function
   * @param {string} name Name of the function in SGAction
   * @returns {jest.SpyInstance}
   */
  const getSpy = name => jest.spyOn(SGAction, name);

  /**
   * Helper: check spy and restore
   * @param {jest.SpyInstance} spy Spy instance
   * @param {*} args Expected arguments
   * @returns {void}
   */
  const checkSpy = (spy, args) => {
    expect(spy).toHaveBeenCalledWith(args);
    spy.mockRestore();
  };

  it('should send events and add restrictions', () => {
    events.forEach((event) => {
      const spy = getSpy(event.SGAction);

      appHandler[event.event](dummyData, restrictions);
      checkSpy(spy, {
        ...dummyData,
        restrictions,
      });
    });
  });
});
