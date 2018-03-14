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
