import SgTrackingCore from '../shopgate-tracking-core';
import SgTrackingAppHandler from '../shopgate-tracking-app-handler';
import dataFormatHelpers from '../modifiers/shopgate-tracking-format-helpers';
import eventNames from '../shopgate-tracking-events';

/**
 * Parent class for all tracking plugins that contains common public functions
 */
class SgTrackingPlugin {
  /**
   * Constructor
   * @param {string} trackerName The name of the tracker that is represented by the plugin
   * @param {Object} options Configuration for the plugin
   * @param {Object} extendedDefaults Additional default options that are
   *                                  needed by the inherited class
   */
  constructor(trackerName, options = {}, extendedDefaults = {}) {
    const defaults = {
      overrideUnified: false,
      useNativeSdk: false,
      useNetPrices: false,
    };

    // Create the options for the plugin
    this.options = { ...defaults, ...extendedDefaults, ...options };

    this.trackingDisabled = false;
    this.trackerName = trackerName || '';
    this.trackingCore = SgTrackingCore;
    this.appHandler = SgTrackingAppHandler;

    /**
     * Storage that contains functions to register callbacks for the different tracking events
     * @type {Object}
     */
    this.register = {};

    eventNames.forEach((eventName) => {
      /**
       * Function to register a plugin for the event
       *
       * @param {Function} callback  Function that is called if the event occurs
       * @param {Object}   [optionParam] Options that will be passed to the core
       * @returns {RemoveListener} Function to remove the listener
       */
      this.register[eventName] =
        (callback, optionParam) => this.registerHelper(eventName, callback, optionParam);
    });
  }

  /**
   * Converts raw tracking event data into the unified data format
   *
   * @param {string} eventName Name of the tracking event
   * @param {Object} rawData Raw data from the core
   * @returns {*} The converted data
   */
  static formatData(eventName, rawData) {
    // Check if a suitable conversion function is available
    if (typeof dataFormatHelpers[eventName] !== 'function') {
      console.warn(`SgTrackingPlugin: Convert function is missing for ${eventName}`);
      return rawData;
    }

    // Convert the raw data
    return dataFormatHelpers[eventName](rawData);
  }

  /**
   * Helper function to register a plugin for a specific event. Can be overwritten in the plugins.
   *
   * @param {string}   eventName Name of the event
   * @param {Function} callback  Callback from the plugin, to modify the data
   * @param {Object}   options   Additional options that will be passed to the core
   * @returns {RemoveListener} Function to remove the listener
   * @private
   */
  registerHelper(eventName, callback, options) {
    // Register the tracking event of the plugin at the core
    return this.trackingCore.register[eventName]((data, scope) => {
      // Convert the tracking data into the unified format
      const unifiedData = SgTrackingPlugin.formatData(eventName, data);

      // Invoke the event callback of the plugin to enable it to extend the data
      const finalData = callback(unifiedData, data, scope);

      /*
       * If final data is explicitly false, it means further processing is up to the plugin only.
       */
      if (finalData === false) {
        return;
      }

      if (this.options.useNativeSdk && this.options.overrideUnified) {
        // Send command to the app via the appHandler
        this.appHandler[eventName](finalData, {
          blacklist: false,
          trackers: [this.trackerName],
        });
      }
    }, {
      ...options,
      trackerName: this.trackerName,
      options: this.options,
    });
  }

  /**
   * Disables the tracking for the plugin
   *
   * @returns {SgTrackingPlugin} The instance of the plugin
   */
  disableTracking() {
    this.trackingDisabled = true;
    return this;
  }

  /**
   * Enables the tracking for the plugin
   *
   * @returns {SgTrackingPlugin} The instance of the plugin
   */
  enableTracking() {
    this.trackingDisabled = false;
    return this;
  }
}

export default SgTrackingPlugin;
