/* eslint global-require: "off" */
import Chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import mochaJsdom from 'mocha-jsdom';

const chai = Chai.use(sinonChai);
const { expect } = chai;

describe('AppHandler', () => {
  let appHandler;
  let SGAction;
  mochaJsdom();

  before(() => {
    global.console.groupCollapsed = () => { };
    global.console.groupEnd = () => { };
    window.SGEvent = {};

    appHandler = require('../core/AppHandler').default;
    // eslint-disable-next-line prefer-destructuring
    SGAction = require('../helpers/helper').SGAction;
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
   * Helper function to create a spy for a function
   * @param {string} name Name of the function in SGAction
   * @returns {Object} spy for the given function
   */
  const getSpy = name => sinon.spy(SGAction, name);

  /**
   * Helper function to check if the spy gets called with the correct data
   * @param {Object} spy Spy object
   * @param {*} args Arguments which the spy should called with
   */
  const checkSpy = (spy, args) => {
    expect(spy).to.have.been.calledWith(args);
    spy.restore();
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
