/**
 * The portals collection.
 */
class PortalCollection {
  /**
   * Returns the portal definitions.
   * @return {Object}
   */
  getPortals() {
    return this.portals;
  }

  /**
   * Registers the portal definitions.
   * @param {Object} [portals={}] The portals to register.
   */
  registerPortals(portals = {}) {
    this.portals = portals;
  }

  /**
   * Registers the portal config.
   * @param {Object} [config={}] The portals config.
   */
  registerConfig(config = {}) {
    this.config = config;
  }

  /**
   * Returns the portal config.
   * @return {Object}
   */
  getConfig() {
    return this.config;
  }
}

export default new PortalCollection();
