/** @jest-environment jsdom */

/* eslint global-require: "off" */
import storageMock from './helpers/localStorage-mock';

describe('Unified', () => {
  let SgUnifiedTracking;
  let SgTrackingCore;
  let trackingHelper;
  let plugin;

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get: () => storageMock(),
    });

    global.Headers = jest.fn();
    global.fetch = jest.fn(() => new Promise(() => {}));
    global.console.groupCollapsed = jest.fn();
    global.console.groupEnd = jest.fn();
    window.SGEvent = {};

    trackingHelper = require('../helpers/helper');
    SgTrackingCore = require('../core/Core').default.reset().registerFinished();
    SgUnifiedTracking = require('../plugins/trackers/Unified').default;
  });

  const events = [
    'viewContent',
    'purchase',
    'addToCart',
    'initiatedCheckout',
    'completedRegistration',
    'addToWishlist',
    'search',
    'addedPaymentInfo',
  ];

  /**
   * Helper to get always the same plugin instance
   */
  function createPluginInstance() {
    plugin = plugin || new SgUnifiedTracking();
  }

  it('should register for events', () => {
    const registerSpy = jest.spyOn(SgUnifiedTracking.prototype, 'registerHelper');

    createPluginInstance();

    const calledEvents = registerSpy.mock.calls.map(call => call[0]);
    expect(calledEvents).toEqual(expect.arrayContaining(events));

    registerSpy.mockRestore();
  });

  it('should do ajax requests', () => {
    const sendSpy = jest.spyOn(trackingHelper, 'sendDataRequest').mockImplementation(() => {});

    createPluginInstance();

    // Trigger opt-out
    SgTrackingCore.optOut();
    expect(sendSpy).toHaveBeenCalledWith('remove_unified_trackers');

    // Revert the opt-out
    SgTrackingCore.optOut(false);
    expect(sendSpy).toHaveBeenCalledWith('add_unified_trackers');

    sendSpy.mockRestore();
  });

  it('should call SgTrackingAppHandler', () => {
    createPluginInstance();

    const spy = jest.spyOn(plugin.appHandler, 'viewContent').mockImplementation(() => {});

    SgTrackingCore.track.viewContent({
      page: {
        link: 'startpage',
        name: 'Startpage',
      },
    });

    expect(spy).toHaveBeenCalledWith(
      {
        id: '',
        type: 'startpage',
        name: 'Startpage',
      },
      {
        blacklist: true,
        trackers: undefined,
      }
    );

    spy.mockRestore();
  });
});
