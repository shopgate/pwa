import pathMatch from 'path-match';

/**
 * Class to maintain the routes that should be protected by authentication.
 */
class AuthRoutes {
  /**
   * Constructor
   */
  constructor() {
    this.routes = new Map();
    this.matcher = pathMatch({
      sensitive: false,
      strict: false,
      end: true,
    });
  }

  /**
   * Finds a particular protected route.
   * @param {string} pattern The pattern to find.
   * @return {string|null}
   */
  get(pattern) {
    return this.routes.get(pattern) || null;
  }

  /**
   * Returns all protected routes.
   * @return {Map}
   */
  getAll() {
    return this.routes;
  }

  /**
   * Sets a new route as protected.
   * @param {string} civilian The route to protect.
   * @param {string} bouncer The protector route.
   */
  set(civilian, bouncer) {
    if (!civilian || !bouncer) {
      return;
    }

    this.routes.set(civilian, bouncer);
  }

  /**
   * Check if the given pathname is a protector route.
   * @param {string} location The location to check.
   * @return {boolean}
   */
  isProtector(location) {
    return Array.from(this.routes.values()).includes(location);
  }

  /**
   * Returns the protector for a passed location.
   * @param {string} location The location to check.
   * @return {string|null}
   */
  getProtector(location) {
    /**
     * Try to make a direct match with the location.
     * If we get lucky then we don't have to iterate over the protected patterns.
     */
    let protector = this.get(location);

    /**
     * If we didn't find a direct match then we need to match
     * the given location against the protected patters.
     */
    if (!protector) {
      // Get the protected patterns as an array.
      const patterns = Array.from(this.routes.keys());
      const [locationWithoutParams] = location.split('?');

      // Loop over the patterns until a match is found.
      patterns.some((pattern) => {
        // Check for a match.
        const match = this.matcher(pattern)(locationWithoutParams);

        // Match found, set the protector.
        if (match) {
          protector = this.routes.get(pattern);
        }

        return match;
      });
    }

    return protector;
  }
}

export default new AuthRoutes();
