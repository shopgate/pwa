import { logger } from '@shopgate/pwa-core/helpers';
import errorManager from '@shopgate/pwa-core/classes/ErrorManager';
import { SOURCE_TRACKING, CODE_TRACKING } from '@shopgate/pwa-core/constants/ErrorManager';
import { optOut, isOptOut } from '../helpers/optOut';
import trackingEvents, {
  REMOVE_TRACKER,
  ADD_TRACKER,
  scannerEvents,
} from '../helpers/events';

/**
 * Core for our tracking system. Plugins can use the core to register for events. Pub/sub pattern.
 */
class Core {
  /**
   * Constructor
   */
  constructor() {
    // Store for the registered events
    this.events = {};

    // Store for all triggered events
    this.triggeredEvents = [];

    this.registerFinish = false;

    /**
     * Storage for functions to register tracking event callbacks
     * @type {Object}
     */
    this.register = {};

    // Create the register functions for every available event
    trackingEvents.forEach((event) => {
      /**
       * Register for event
       * @param {Function} callback Function that is called if the event occurs
       * @param {Object} options Additional options
       * @returns {RemoveListener} Function to remove the listener
       */
      this.register[event] = (callback, options) => this.registerHelper(callback, event, options);
    });

    /**
     * Storage for functions that trigger tracking events
     * @type {Object}
     */
    this.track = {};

    // Create the track functions for every available event
    trackingEvents.forEach((event) => {
      // Don't create track functions for those events
      if ([REMOVE_TRACKER, ADD_TRACKER].indexOf(event) !== -1) {
        return;
      }

      /**
       * Track event
       * @param {Object} rawData Raw data from sgData Object
       * @param {string} [page] Identifier of the page
       * @param {Object} [scope] Scope for the event
       * @param {Object} [state] The redux state
       * @returns {Core} Instance of Core
       */
      this.track[event] = (rawData, page, scope, state) =>
        this.notifyPlugins({ ...rawData }, event, page, scope, state);
    });
  }

  /**
   * Returns and creates event store if needed
   *
   * @param {string} eventName Name of the event
   * @param {string} [page] Identifier of the page
   * @returns {Object} The event store for the given eventName and page
   */
  getEventStore(eventName, page) {
    if (!this.events.hasOwnProperty(eventName)) {
      // Create a new event store entry for the current event name, if no one is already present
      this.events[eventName] = {
        // Events for every page
        global: [],

        // Events only for specific pages
        specific: {},
      };
    }

    // Get the global events for the current event name
    let eventStore = this.events[eventName].global;

    if (page) {
      // A page name was provided, which means that we have to use the page specific sub store
      eventStore = this.events[eventName].specific;

      if (!eventStore.hasOwnProperty(page)) {
        // There is no entry for the current page, so we initialize it
        eventStore[page] = [];
      }

      // Prepare the specific event store for the provided page as return value
      eventStore = eventStore[page];
    }

    return eventStore;
  }

  /**
   * Register a tracking event callback for a plugin
   *
   * @param {Function} callback Function that is called if the event occurs
   * @param {string} eventName Name of the event
   * @param {Object} options Additional options
   * @returns {RemoveListener} Function to remove the listener
   */
  registerHelper(callback, eventName, options = {}) {
    const defaults = {
      trackerName: '',
      page: null,
      merchant: true,
      shopgate: true,
      options: {},
    };

    const pluginOptions = {
      ...defaults,
      ...options,
    };

    if (!pluginOptions.trackerName) {
      logger.warn(`'SgTrackingCore': Attempt to register for event "${eventName}" by a nameless tracker`);
    }

    // Get the correct store
    const store = this.getEventStore(eventName, pluginOptions.page);

    // Add the callback to queue
    const index = store.push({
      callback,
      trackerName: pluginOptions.trackerName,
      useNativeSdk: pluginOptions.options.useNativeSdk,
      overrideUnified: pluginOptions.options.overrideUnified,
      merchant: pluginOptions.merchant,
      shopgate: pluginOptions.shopgate,
    }) - 1;

    // Provide handle back for removal of event
    return {
      remove() {
        delete store[index];
      },
    };
  }

  /**
   * Notify plugins helper
   *
   * @param {Object} rawData Object with tracking data for the event
   * @param {string} eventName Name of the event
   * @param {string} [page] Identifier of the page
   * @param {Object} [scope] Scope of the event
   * @param {Object} [state] The redux state
   * @returns {void}
   */
  notifyHelper(rawData, eventName, page, scope = {}, state) {
    // Exit if the user opt out. But not for the explicit add or remove tracker events
    if ([REMOVE_TRACKER, ADD_TRACKER].indexOf(eventName) === -1 && isOptOut()) {
      return;
    }

    // Default scope
    const scopeOptions = {
      shopgate: true,
      merchant: true,
      ...scope,
    };

    // Get the global list of registered callbacks for the event name
    const storeGlobal = this.getEventStore(eventName);

    // Get the page specific list of registered callbacks
    const storePage = page ? this.getEventStore(eventName, page) : [];

    // Initialize the event payload
    const eventData = typeof rawData !== 'undefined' ? rawData : {};

    // Merge the global with the page specific callbacks
    const combinedStorage = storeGlobal.concat(storePage);

    const blacklist = [];
    let useBlacklist = false;

    /**
     * Loop through the queue and check if there is a unified and other plugins.
     * Registered callbacks of plugins not equal to the unified one, have to be added to a
     * blacklist, so that the app does not propagate the unified data, but the custom one
     * to the related trackers.
     */
    combinedStorage.forEach((entry) => {
      if (entry.trackerName !== 'unified' && entry.useNativeSdk) {
        blacklist.push(entry.trackerName.slice(0));
      } else {
        // If there is a unified plugin registered for this event -> use the blacklist
        useBlacklist = true;
      }
    });

    // Only use the blacklist if it contains elements
    if (useBlacklist) {
      useBlacklist = !!blacklist.length;
    }

    // Cycle through events queue, fire!
    combinedStorage.forEach((entry) => {
      // Merchant only command
      if (scopeOptions.merchant && !scopeOptions.shopgate && !entry.merchant) {
        return;

        // Shopgate only command
      }

      if (!scopeOptions.merchant && scopeOptions.shopgate && !entry.shopgate) {
        return;
      }

      const params = [eventData, scopeOptions, undefined, state];

      if (entry.trackerName === 'unified' && useBlacklist) {
        // Pass the unifiedBlacklist to the plugin if the plugin is the unified one
        params[2] = blacklist;
      }
      try {
        entry.callback.apply(this, params);
      } catch (err) {
        logger.error(`'SgTrackingCore': Error in plugin [${entry.trackerName}]`, err);

        err.code = CODE_TRACKING;
        err.source = SOURCE_TRACKING;
        err.context = entry.trackerName;

        errorManager.queue(err);
      }
    });
  }

  /**
   * Notify plugins
   *
   * @param {Object} rawData Object with tracking data for the event
   * @param {string} eventName Name of the event
   * @param {string} [page] Identifier of the page
   * @param {Object} [scope] Scope of the event
   * @param {Object} [state] The redux state
   * @returns {Core} Instance of the core instance
   */
  notifyPlugins(rawData, eventName, page, scope, state) {
    // If registration is finished
    if (this.registerFinish) {
      this.notifyHelper(rawData, eventName, page, scope, state);
    } else {
    // Store the event if not
      this.triggeredEvents.push({
        function: this.notifyHelper,
        params: [rawData, eventName, page, scope, state],
      });
    }

    return this;
  }

  /**
   * Opt out mechanism for all tracking tools
   *
   * @param {boolean} [optOutParam = true] If false -> revert the opt out (enable tracking)
   * @returns {boolean|null} State which was set
   */
  optOut(optOutParam) {
    let out = optOutParam;

    if (typeof optOutParam === 'undefined') {
      out = true;
    }

    if (out) {
      // Notify Plugins about the removal.
      this.notifyPlugins(null, REMOVE_TRACKER);
    } else {
      // Notify Plugins about the adding
      this.notifyPlugins(null, ADD_TRACKER);
    }

    return optOut(out);
  }

  /**
   * Check if the opt-out state is set
   *
   * @returns {boolean} Information about the opt out state
   */
  isOptOut = () => isOptOut();

  /**
   * Returns scanner (adscanner and QR) event action constants.
   *
   * @returns {Object} Scanner events
   */
  getScannerEvents = () => scannerEvents;

  /**
   * Helper function to create ad scanner opt_label from pageTitle and pageId
   *
   * @param {string} pageTitle Name of the Page
   * @param {string} id ID of the ad
   * @returns {string} String from pageTitle and pageId
   */
  buildAdImageIdentifierName = (pageTitle, id) => {
    const name = (pageTitle) ? `${pageTitle} ` : '';

    return `${name}(id: ${id})`;
  };

  /**
   * This function will handle the cross domain tracking, depending on which sdks are there
   * @param {string} originalUrl url of the link
   * @param {HTMLFormElement} [formElement] Form element if we do a POST
   * @returns {boolean|string} Tells if the function executed the steps that are necessary
   *          for domain transitions via tracking plugins. In a sg cloud app it returns the new url.
   */
  crossDomainTracking = (originalUrl, formElement) => {
    if (window.sgData && window.sgData.device.access === 'App') {
      return false;
    }

    let newUrl = originalUrl;

    // Add econda params
    if (typeof window.getEmosCrossUrlParams === 'function') {
      newUrl += (!newUrl.includes('?') ? '?' : '&') + window.getEmosCrossUrlParams();
    }

    // If there is no sgData, we are in sg cloud app and have to return the new url
    if (!window.sgData) {
      return newUrl;
    }

    // Universal
    try {
      window.ga(() => {
        const tracker = window.ga.getByName('shopgate');
        const linker = new window.gaplugins.Linker(tracker);
        // Add ?_ga parameter to the url
        newUrl = linker.decorate(newUrl);
      });
    } catch (e) {
      // Ignore errors
    }

    // Check if there is the classic sdk
    if (typeof _gaq === 'undefined') {
      // No classic sdk

      if (formElement) {
        /**
         * The no-param-reassign rule is deactivated on purpose,
         * since the form action has to be replaced in this situation
         */
        // eslint-disable-next-line no-param-reassign
        formElement.action = newUrl;
      } else {
        window.location.href = newUrl;
      }
    } else if (formElement) {
      // eslint-disable-next-line no-underscore-dangle
      window._gaq.push(['merchant_._linkByPost', formElement]);
    } else {
      // eslint-disable-next-line no-underscore-dangle
      window._gaq.push(['merchant_._link', newUrl]);
    }

    return true;
  };

  /**
   * Called from the outside when all plugins are registered
   * @return {Core}
   */
  registerFinished() {
    if (this.registerFinish) {
      return this;
    }

    // Trigger all events that happened till now
    this.triggeredEvents.forEach((entry) => {
      entry.function.apply(this, entry.params);
    });

    this.registerFinish = true;

    // Reset the event store
    this.triggeredEvents = [];

    return this;
  }

  /**
   * Remove all registered callbacks. Only used and needed for unit tests
   * @returns {Core}
   */
  reset() {
    this.events = {};
    this.triggeredEvents = [];
    this.registerFinish = false;
    return this;
  }
}

/**
 * Fix to prevent multiple instances of this class caused by two node_modules folders
 */
if (!window.SgTrackingCore) {
  window.SgTrackingCore = new Core();
}

export default window.SgTrackingCore;
