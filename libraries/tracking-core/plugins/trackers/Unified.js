/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { sendDataRequest } from '../../helpers/helper';
import BasePlugin from '../Base';

/**
 * Tracking Plugin for our unified tracking system
 */
class Unified extends BasePlugin {
  /**
   * @param {Object} [options] configuration
   */
  constructor(options = {}) {
    const trackerName = options.trackerName || 'unified';

    // Invoke the parent constructor
    super(trackerName, options);

    this.register.viewContent(data => data);
    this.register.setCampaignWithUrl(data => data);
    this.register.purchase(data => data);
    this.register.addToCart(data => data);
    this.register.initiatedCheckout(data => data);
    this.register.completedRegistration(data => data);
    this.register.addToWishlist(data => data);
    this.register.search(data => data);
    this.register.addedPaymentInfo(data => data);

    this.trackingCore.register.removeTracker(() => {
      // Send request to server to remove the tracker
      sendDataRequest('remove_unified_trackers');
    }, {
      trackerName: this.trackerName,
      options: this.options,
    });

    this.trackingCore.register.addTracker(() => {
      // Send request to server to add the tracker again
      sendDataRequest('add_unified_trackers');
    }, {
      trackerName: this.trackerName,
      options: this.options,
    });
  }

  /**
   * Helper function to register a plugin for a specific event. Overwrites the parent function with
   * special logic for the blacklist system.
   *
   * @param {string} eventName Name of the event
   * @param {Function} callback Callback from the plugin, to modify the data
   * @returns {RemoveListener} Function to remove the listener
   * @private
   */
  registerHelper(eventName, callback) {
    // Register the tracking event of the plugin at the core
    return this.trackingCore.register[eventName]((data, scope, blacklist, state) => {
      if (typeof this.appHandler[eventName] !== 'function') {
        console.warn(`this.appHandler[${eventName}] is not a function`);
        return;
      }

      // Convert the tracking data into the unified format
      const unifiedData = BasePlugin.formatData(eventName, data);

      // Invoke the event callback of the plugin to enable it to extend the data
      const finalData = callback(unifiedData, data, scope, state);

      // Send command to the app via the appHandler
      this.appHandler[eventName](finalData, {
        blacklist: true,
        trackers: blacklist,
      });
    }, {
      trackerName: this.trackerName,
      options: this.options,
    });
  }
}

window.SgUnifiedTracking = Unified;

export default Unified;
