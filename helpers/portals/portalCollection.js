/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The portals collection.
 */
class PortalCollection {
  /**
   * Registers the portal definitions.
   * @param {Object} [portals={}] The portals to register.
   */
  registerPortals(portals = {}) {
    this.portals = portals;
  }

  /**
   * Returns the portal definitions.
   * @return {Object}
   */
  getPortals() {
    return this.portals;
  }
}

export default new PortalCollection();
