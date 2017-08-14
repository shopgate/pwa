import { optOut, isOptOut } from './shopgate-tracking-opt-out';

/**
 * Core for our tracking system. Plugins can use the core to register for events. Pub/sub pattern.
 *
 * @constructor
 */
function SgTrackingCore() {
  // List of available tracking events
  const TRACK_PAGEVIEW = 'pageview';
  const TRACK_VIEW_CONTENT = 'viewContent';
  const TRACK_PURCHASE = 'purchase';
  const TRACK_ADD_TO_CART = 'addToCart';
  const TRACK_ADD_TO_WISHLIST = 'addToWishlist';
  const TRACK_INITIATED_CHECKOUT = 'initiatedCheckout';
  const TRACK_COMPLETED_REGISTRATION = 'completedRegistration';
  const TRACK_SEARCH = 'search';
  const TRACK_SCROLL_TOP = 'scrollTop';
  const TRACK_ADDED_PAYMENT_INFO = 'addedPaymentInfo';
  const TRACK_SMARTBANNER = 'smartbanner';
  const TRACK_FILTER_LIVE_SUGGEST = 'filterLiveSuggest';
  const TRACK_QR_SCANNER = 'qrScanner';
  const TRACK_AD_SCANNER = 'adScanner';
  const TRACK_CC_SCANNER = 'ccScanner';
  const TRACK_OPEN_DEEP_LINK = 'openDeepLink';
  const TRACK_OPEN_UNIVERSAL_LINK = 'openUniversalLink';
  const TRACK_OPEN_DEFERRED_DEEP_LINK = 'openDeferredDeepLink';
  const TRACK_OPEN_SMART_APP_DOWNLOAD_LINK = 'openSmartAppDownloadLink';
  const TRACK_OPEN_PUSH_NOTIFICATION = 'openPushNotification';
  const TRACK_APP_REVIEW_PROMPT = 'appReviewPrompt';
  const TRACK_SET_CAMPAIGN_WITH_URL = 'setCampaignWithUrl';

  const REMOVE_TRACKER = 'removeTracker';
  const ADD_TRACKER = 'addTracker';

  // Store for the registered events
  let events = {};

  // Store for all triggered events
  let triggeredEvents = [];

  let registerFinish = false;

  /**
   * Returns a list of all custom events
   * @returns {Array} list of all custom events
   */
  this.getCustomEvents = () => [
    TRACK_SMARTBANNER,
    TRACK_FILTER_LIVE_SUGGEST,
    TRACK_QR_SCANNER,
    TRACK_AD_SCANNER,
    TRACK_CC_SCANNER,
    TRACK_SCROLL_TOP,
    TRACK_OPEN_DEEP_LINK,
    TRACK_OPEN_UNIVERSAL_LINK,
    TRACK_OPEN_DEFERRED_DEEP_LINK,
    TRACK_OPEN_SMART_APP_DOWNLOAD_LINK,
    TRACK_OPEN_PUSH_NOTIFICATION,
    TRACK_APP_REVIEW_PROMPT,
  ];

  /**
   * Returns and creates event store if needed
   *
   * @param {string} eventName Name of the event
   * @param {string} [page] Identifier of the page
   * @returns {Object} The event store for the given eventName and page
   * @private
   */
  const getEventStore = (eventName, page) => {
    if (!events.hasOwnProperty(eventName)) {
      // Create a new event store entry for the current event name, if no one is already present
      events[eventName] = {
        // Events for every page
        global: [],

        // Events only for specific pages
        specific: {},
      };
    }

    // Get the global events for the current event name
    let eventStore = events[eventName].global;

    if (page) {
      // A page name was provided, which means that we have to use the page specific sub store
      eventStore = events[eventName].specific;

      if (!eventStore.hasOwnProperty(page)) {
        // There is no entry for the current page, so we initialize it
        eventStore[page] = [];
      }

      // Prepare the specific event store for the provided page as return value
      eventStore = eventStore[page];
    }

    return eventStore;
  };

  /**
   * Register a tracking event callback for a plugin
   *
   * @param {Function} callback Function that is called if the event occurs
   * @param {string} eventName Name of the event
   * @param {Object} options Additional options
   * @returns {RemoveListener} Function to remove the listener
   * @private
   */
  const registerHelper = (callback, eventName, options = {}) => {
    const defaults = {
      trackerName: '',
      page: null,
      merchant: true,
      shopgate: true,
      options: {},
    };

    const pluginOptions = { ...defaults, ...options };

    if (!pluginOptions.trackerName) {
      console.warn(`'SgTrackingCore': Attempt to register for event "${eventName}" by a nameless tracker`);
    }

    // Get the correct store
    const store = getEventStore(eventName, pluginOptions.page);

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
  };

  /**
   * Notify plugins helper
   *
   * @param {Object} rawData   Object with tracking data for the event
   * @param {string} eventName Name of the event
   * @param {string} [page]    Identifier of the page
   * @param {Object} [scope]   Scope of the event
   * @returns {void}
   * @private
   */
  const notifyHelper = (rawData, eventName, page, scope = {}) => {
    // Exit if the user opt out. but not for the explicit add or remove tracker events
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
    const storeGlobal = getEventStore(eventName);

    // Get the page specific list of registered callbacks
    const storePage = page ? getEventStore(eventName, page) : [];

    // Initialize the event payload
    const eventData = typeof rawData !== 'undefined' ? rawData : {};

    // Merge the global with the page specific callbacks
    const combinedStorage = storeGlobal.concat(storePage);

    const blacklist = [];
    let useBlacklist = false;

    console.info('[TRACK]', eventName, rawData);

    /*
     Loop through the queue and check if there is a unified and other plugins.
     Registered callbacks of plugins not equal to the unified one, have to be added to a
     blacklist, so that the app does not propagate the unified data, but the custom one
     to the related trackers.
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
      } else if (!scopeOptions.merchant && scopeOptions.shopgate && !entry.shopgate) {
        return;
      }

      const params = [eventData, scopeOptions];

      if (entry.trackerName === 'unified' && useBlacklist) {
        // Pass the unifiedBlacklist to the plugin if the plugin is the unified one
        params.push(blacklist);
      }
      entry.callback.apply(this, params);
    });
  };

  /**
   * Notify plugins
   *
   * @param {Object} rawData   Object with tracking data for the event
   * @param {string} eventName Name of the event
   * @param {string} [page]    Identifier of the page
   * @param {Object} [scope]   Scope of the event
   * @returns {void}
   * @private
   */
  const notifyPlugins = (rawData, eventName, page, scope) => {
    // If registration is finished
    if (registerFinish) {
      notifyHelper(rawData, eventName, page, scope);
    } else {
      // Store the event if not
      triggeredEvents.push({
        function: notifyHelper,
        params: [rawData, eventName, page, scope],
      });
    }
  };

  /**
   * Storage for functions to register tracking event callbacks
   * @type {Object}
   */
  this.register = {
    /**
     * Register for pageview event
     *
     * @param {Function} callback Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     */
    pageview(callback, options) {
      return registerHelper(callback, TRACK_PAGEVIEW, options);
    },

    /**
     * Register for viewContent event
     *
     * @param {Function} callback Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     */
    viewContent(callback, options) {
      return registerHelper(callback, TRACK_VIEW_CONTENT, options);
    },

    /**
     * Register for purchase event
     * @param {Function} callback Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     */
    purchase(callback, options) {
      return registerHelper(callback, TRACK_PURCHASE, options);
    },

    /**
     * Register for addToCart event
     * @param {Function} callback Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     */
    addToCart(callback, options) {
      return registerHelper(callback, TRACK_ADD_TO_CART, options);
    },

    /**
     * Register for addToWishlist event
     * @param {Function} callback Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     */
    addToWishlist(callback, options) {
      return registerHelper(callback, TRACK_ADD_TO_WISHLIST, options);
    },

    /**
     * Register for initiatedCheckout event
     * @param {Function} callback Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     */
    initiatedCheckout(callback, options) {
      return registerHelper(callback, TRACK_INITIATED_CHECKOUT, options);
    },

    /**
     * Register for completedRegistration event
     * @param {Function} callback  Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     * to remove the event listener again
     */
    completedRegistration(callback, options) {
      return registerHelper(callback, TRACK_COMPLETED_REGISTRATION, options);
    },
    /**
     * Register for search event
     * @param {Function} callback Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     */
    search(callback, options) {
      return registerHelper(callback, TRACK_SEARCH, options);
    },

    /**
     * Register for analyticsLogAddedPaymentInfo event
     * @param {Function} callback Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     */
    addedPaymentInfo(callback, options) {
      return registerHelper(callback, TRACK_ADDED_PAYMENT_INFO, options);
    },

    /**
     * Register for smartbanner events
     * @param {Function} callback Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     */
    smartbanner(callback, options) {
      return registerHelper(callback, TRACK_SMARTBANNER, options);
    },

    /**
     * Register for qr scanner events
     * @param {Function} callback Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     */
    qrScanner(callback, options) {
      return registerHelper(callback, TRACK_QR_SCANNER, options);
    },
    /**
     * Register for ad scanner events
     * @param {Function} callback Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     */
    adScanner(callback, options) {
      return registerHelper(callback, TRACK_AD_SCANNER, options);
    },
    /**
     * Register for cc scanner events
     * @param {Function} callback Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     */
    ccScanner(callback, options) {
      return registerHelper(callback, TRACK_CC_SCANNER, options);
    },

    /**
     * Register for filter live suggest events
     * @param {Function} callback Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     */
    filterLiveSuggest(callback, options) {
      return registerHelper(callback, TRACK_FILTER_LIVE_SUGGEST, options);
    },

    /**
     * Register for remove tracker event
     * @param {Function} callback Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     */
    removeTracker(callback, options) {
      return registerHelper(callback, REMOVE_TRACKER, options);
    },

    /**
     * Register for add tracker event
     * @param {Function} callback Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     */
    addTracker(callback, options) {
      return registerHelper(callback, ADD_TRACKER, options);
    },

    /**
     * Register for scroll top event
     * @param {Function} callback Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     */
    scrollTop(callback, options) {
      return registerHelper(callback, TRACK_SCROLL_TOP, options);
    },

    /**
     * Register for open deep link event
     * @param {Function} callback Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     */
    openDeepLink(callback, options) {
      return registerHelper(callback, TRACK_OPEN_DEEP_LINK, options);
    },

    /**
     * Register for open universal link event
     * @param {Function} callback Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     */
    openUniversalLink(callback, options) {
      return registerHelper(callback, TRACK_OPEN_UNIVERSAL_LINK, options);
    },

    /**
     * Register for open deferred deep link event
     * @param {Function} callback Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     */
    openDeferredDeepLink(callback, options) {
      return registerHelper(callback, TRACK_OPEN_DEFERRED_DEEP_LINK, options);
    },

    /**
     * Register for open smart app download link event
     * @param {Function} callback Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     */
    openSmartAppDownloadLink(callback, options) {
      return registerHelper(callback, TRACK_OPEN_SMART_APP_DOWNLOAD_LINK, options);
    },

    /**
     * Register for open push notification event
     * @param {Function} callback Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     */
    openPushNotification(callback, options) {
      return registerHelper(callback, TRACK_OPEN_PUSH_NOTIFICATION, options);
    },

    /**
     * Register for app review prompt event
     * @param {Function} callback Function that is called if the event occurs
     * @param {Object} options Additional options
     * @returns {RemoveListener} Function to remove the listener
     */
    appReviewPrompt(callback, options) {
      return registerHelper(callback, TRACK_APP_REVIEW_PROMPT, options);
    },

    setCampaignWithUrl(callback, options) {
      return registerHelper(callback, TRACK_SET_CAMPAIGN_WITH_URL, options);
    },
  };

  /**
   * Storage for functions that trigger tracking events
   * @type {Object}
   */
  this.track = {
    /**
     * Track pageview
     * @param {Object} rawData Raw data from sgData Object
     * @param {string} [page]  Identifier of the page
     * @param {Object} [scope] Scope for the event
     * @returns {SgTrackingCore} Instance of SgTrackingCore
     */
    pageview(rawData, page, scope) {
      notifyPlugins({ ...rawData }, TRACK_PAGEVIEW, page, scope);

      return this;
    },

    /**
     * Track viewContent
     * @param {Object} rawData Raw data from sgData Object
     * @param {string} [page]  Identifier of the page
     * @param {Object} [scope] Scope for the event
     * @returns {SgTrackingCore} Instance of SgTrackingCore
     */
    viewContent(rawData, page, scope) {
      notifyPlugins({ ...rawData }, TRACK_VIEW_CONTENT, page, scope);

      return this;
    },

    /**
     * Track purchase
     * @param {Object} rawData Raw data from sgData Object
     * @param {string} [page]  Identifier of the page
     * @param {Object} [scope] Scope for the event
     * @returns {SgTrackingCore} Instance of SgTrackingCore
     */
    purchase(rawData, page, scope) {
      notifyPlugins({ ...rawData }, TRACK_PURCHASE, page, scope);

      return this;
    },

    /**
     * Track add to cart
     * @param {Object} rawData Raw data from sgData Object
     * @param {string} [page]  Identifier of the page
     * @param {Object} [scope] Scope for the event
     * @returns {SgTrackingCore} Instance of SgTrackingCore
     */
    addToCart(rawData, page, scope) {
      notifyPlugins({ ...rawData }, TRACK_ADD_TO_CART, page, scope);

      return this;
    },

    /**
     * Track add to cart
     * @param {Object} rawData Raw data from sgData Object
     * @param {string} [page] Identifier of the page
     * @param {Object} [scope] Scope for the event
     * @returns {SgTrackingCore} Instance of SgTrackingCore
     */
    addToWishlist(rawData, page, scope) {
      notifyPlugins({ ...rawData }, TRACK_ADD_TO_WISHLIST, page, scope);

      return this;
    },

    /**
     * Track initiatedCheckout
     * @param {Object} rawData Raw data from sgData Object
     * @param {string} [page]  Identifier of the page
     * @param {Object} [scope] Scope for the event
     * @returns {SgTrackingCore} Instance of SgTrackingCore
     */
    initiatedCheckout(rawData, page, scope) {
      notifyPlugins({ ...rawData }, TRACK_INITIATED_CHECKOUT, page, scope);

      return this;
    },

    /**
     * Track completed registration
     * @param {Object} rawData Raw data from sgData Object extended with
     *                         registrationType information
     * @param {string} [page]    Identifier of the page
     * @param {Object} [scope] Scope for the event
     * @returns {SgTrackingCore} Instance of SgTrackingCore
     */
    completedRegistration(rawData, page, scope) {
      notifyPlugins({ ...rawData }, TRACK_COMPLETED_REGISTRATION, page, scope);

      return this;
    },

    /**
     * Track search
     * @param {Object} rawData Raw data from sgData Object
     * @param {string} [page]  Identifier of the page
     * @param {Object} [scope] Scope for the event
     * @returns {SgTrackingCore} Instance of SgTrackingCore
     */
    search(rawData, page, scope) {
      notifyPlugins({ ...rawData }, TRACK_SEARCH, page, scope);

      return this;
    },

    /**
     * Track analyticsLogAddedPaymentInfo
     * @param {Object} rawData Raw data from sgData Object
     * @param {string} [page] Identifier of the page
     * @param {Object} [scope] Scope for the event
     * @returns {SgTrackingCore} Instance of SgTrackingCore
     */
    addedPaymentInfo(rawData, page, scope) {
      notifyPlugins({ ...rawData }, TRACK_ADDED_PAYMENT_INFO, page, scope);

      return this;
    },

    /**
     * Track smartbanner events
     * @param {Object} rawData Raw data
     * @param {string} [page] Identifier of the page
     * @param {Object} [scope] Scope for the event
     * @returns {SgTrackingCore} Instance of SgTrackingCore
     */
    smartbanner(rawData, page, scope) {
      notifyPlugins({ ...rawData }, TRACK_SMARTBANNER, page, scope);

      return this;
    },

    /**
     * Track qr scanner events
     * @param {Object} rawData Raw data from sgData Object
     * @param {string} [page] Identifier of the page
     * @param {Object} [scope] Scope for the event
     * @returns {SgTrackingCore} Instance of SgTrackingCore
     */
    qrScanner(rawData, page, scope) {
      notifyPlugins({ ...rawData }, TRACK_QR_SCANNER, page, scope);

      return this;
    },

    /**
     * Track ad scanner events
     * @param {Object} rawData Raw data from sgData Object
     * @param {string} [page] Identifier of the page
     * @param {Object} [scope] Scope for the event
     * @returns {SgTrackingCore} Instance of SgTrackingCore
     */
    adScanner(rawData, page, scope) {
      notifyPlugins({ ...rawData }, TRACK_AD_SCANNER, page, scope);

      return this;
    },

    /**
     * Track cc scanner events
     * @param {Object} rawData Raw data from sgData Object
     * @param {string} [page] Identifier of the page
     * @param {Object} [scope] Scope for the event
     * @returns {SgTrackingCore} Instance of SgTrackingCore
     */
    ccScanner(rawData, page, scope) {
      notifyPlugins({ ...rawData }, TRACK_CC_SCANNER, page, scope);

      return this;
    },

    /**
     * Track filter live suggest events
     * @param {Object} rawData Raw data
     * @param {string} [page] Identifier of the page
     * @param {Object} [scope] Scope for the event
     * @returns {SgTrackingCore} Instance of SgTrackingCore
     */
    filterLiveSuggest(rawData, page, scope) {
      notifyPlugins({ ...rawData }, TRACK_FILTER_LIVE_SUGGEST, page, scope);

      return this;
    },

    /**
     * Track scrollTop
     * @param {Object} rawData Raw data from sgData Object
     * @param {string} [page] Identifier of the page
     * @param {Object} [scope] Scope for the event
     * @returns {SgTrackingCore} Instance of SgTrackingCore
     */
    scrollTop(rawData, page, scope) {
      notifyPlugins({ ...rawData }, TRACK_SCROLL_TOP, page, scope);

      return this;
    },

    /**
     * Tracks open a link from a deep link
     * @param {Object} rawData Raw data from sgData Object
     * @param {string} [page] Identifier of the page
     * @param {Object} [scope] Scope for the event
     * @returns {SgTrackingCore} Instance of SgTrackingCore
     */
    openDeepLink(rawData, page, scope) {
      notifyPlugins({ ...rawData }, TRACK_OPEN_DEEP_LINK, page, scope);

      return this;
    },

    /**
     * Tracks open a link from a universal link
     * @param {Object} rawData Raw data from sgData Object
     * @param {string} [page] Identifier of the page
     * @param {Object} [scope] Scope for the event
     * @returns {SgTrackingCore} Instance of SgTrackingCore
     */
    openUniversalLink(rawData, page, scope) {
      notifyPlugins({ ...rawData }, TRACK_OPEN_UNIVERSAL_LINK, page, scope);

      return this;
    },

    /**
     * Tracks open a link from a deferred deep link
     * @param {Object} rawData Raw data from sgData Object
     * @param {string} [page] Identifier of the page
     * @param {Object} [scope] Scope for the event
     * @returns {SgTrackingCore} Instance of SgTrackingCore
     */
    openDeferredDeepLink(rawData, page, scope) {
      notifyPlugins({ ...rawData }, TRACK_OPEN_DEFERRED_DEEP_LINK, page, scope);

      return this;
    },

    /**
     * Tracks open a link from a deferred deep link
     * @param {Object} rawData Raw data from sgData Object
     * @param {string} [page] Identifier of the page
     * @param {Object} [scope] Scope for the event
     * @returns {SgTrackingCore} Instance of SgTrackingCore
     */
    openSmartAppDownloadLink(rawData, page, scope) {
      notifyPlugins({ ...rawData }, TRACK_OPEN_SMART_APP_DOWNLOAD_LINK, page, scope);

      return this;
    },

    /**
     * Tracks open a link from a deferred deep link
     * @param {Object} rawData Raw data from sgData Object
     * @param {string} [page] Identifier of the page
     * @param {Object} [scope] Scope for the event
     * @returns {SgTrackingCore} Instance of SgTrackingCore
     */
    openPushNotification(rawData, page, scope) {
      notifyPlugins({ ...rawData }, TRACK_OPEN_PUSH_NOTIFICATION, page, scope);

      return this;
    },

    /**
     * Tracks the app review prompt decision
     * @param {Object} rawData Raw data from sgData Object
     * @param {string} [page] Identifier of the page
     * @param {Object} [scope] Scope for the event
     * @returns {SgTrackingCore} Instance of SgTrackingCore
     */
    appReviewPrompt(rawData, page, scope) {
      notifyPlugins({ ...rawData }, TRACK_APP_REVIEW_PROMPT, page, scope);

      return this;
    },

    setCampaignWithUrl(rawData, page, scope) {
      notifyPlugins({ ...rawData }, TRACK_SET_CAMPAIGN_WITH_URL, page, scope);

      return this;
    },
  };

  /**
   * Opt out mechanism for all tracking tools
   *
   * @param {boolean} [optOutParam = true] if false -> revert the opt out (enable tracking)
   * @returns {boolean|null} - state which was set
   */
  this.optOut = (optOutParam) => {
    let out = optOutParam;

    if (typeof optOutParam === 'undefined') {
      out = true;
    }

    if (out) {
      // Notify Plugins about the removal.
      notifyPlugins(null, REMOVE_TRACKER);
    } else {
      // Notify Plugins about the adding
      notifyPlugins(null, ADD_TRACKER);
    }

    return optOut(out);
  };

  /**
   * Check if the opt-out state is set
   *
   * @returns {boolean} Information about the opt out state
   */
  this.isOptOut = () => isOptOut();

  /**
   * Returns scanner (adscanner and QR) event action constants.
   *
   * @returns {Object} Scanner events
   */
  this.getScannerEvents = () => ({
    // Scan type is activated
    SCAN_ACTIVATED: 'scan_activated',

    // The actual scan stated (for QR scanner same as activated)
    SCAN_STARTED: 'scan_started',

    // Scanning process cancelled
    SCAN_CANCELED: 'scan_canceled',

    // Scan ended with success
    SCAN_SUCCESS: 'scan_success',

    // Scan ended with no result
    SCAN_FAIL: 'scan_fail',

    // User interact with scanning result (click on link)
    SCAN_USER_LINK_INTERACTION: 'scan_user_link_interaction',
  });

  /**
   * Helper function to create ad scanner opt_label from pageTitle and pageId
   *
   * @param {string} pageTitle Name of the Page
   * @param {string} id ID of the ad
   * @returns {string} String from pageTitle and pageId
   */
  this.buildAdImageIdentifierName = (pageTitle, id) => {
    const name = (pageTitle) ? `${pageTitle} ` : '';

    return `${name}(id: ${id})`;
  };

  /**
   * This function will handle the cross domain tracking, depending on which sdks are there
   * @param {string} originalUrl url of the link
   * @param {HTMLFormElement} [formElement] Form element if we do a POST
   * @returns {boolean} Tells if the function executed the steps that are necessary for domain
   *   transitions via tracking plugins.
   */
  this.crossDomainTracking = (originalUrl, formElement) => {
    if (window.sgData.device.access === 'App') {
      return false;
    }

    let newUrl = originalUrl;

    // Add econda params
    if (typeof window.getEmosCrossUrlParams === 'function') {
      newUrl += (!newUrl.includes('?') ? '?' : '&') + window.getEmosCrossUrlParams();
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
        /*
         The no-param-reassign rule is deactivated on purpose,
         since the form action has to be replaced in this situation
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
   * @return {SgTrackingCore}
   */
  this.registerFinished = () => {
    if (registerFinish) {
      return this;
    }

    // Trigger all events that happened til now
    triggeredEvents.forEach((entry) => {
      entry.function.apply(this, entry.params);
    });

    registerFinish = true;

    // Reset the event store
    triggeredEvents = [];

    return this;
  };

  /**
   * Remove all registered callbacks. Only used and needed for unit tests
   * @returns {SgTrackingCore}
   */
  this.reset = () => {
    events = {};
    triggeredEvents = [];
    registerFinish = false;
    return this;
  };
}

// Export the "module"
window.SgTrackingCore = new SgTrackingCore();

export default window.SgTrackingCore;
