/**
 * Class to maintain the routes that should be protected by authentication.
 */
class AuthRoutes {
  /**
   * Constructor
   */
  constructor() {
    this.routes = new Map();
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
}

export default new AuthRoutes();
