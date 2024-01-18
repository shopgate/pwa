import pathMatch from 'path-match';
import queryString from 'query-string';

/**
 * The Redirects class.
 */
class Redirects {
  /**
   * The constructor.
   */
  constructor() {
    this.redirects = new Map();
    this.matcher = pathMatch({
      sensitive: false,
      strict: false,
      end: true,
    });
  }

  /**
   * Returns a specified element from the internal "redirects" Map object.
   * @param {string} pathname The pathname to lookup.
   * @private
   * @returns {string|Function|Promise|null}
   */
  get(pathname) {
    return this.redirects.get(pathname) || null;
  }

  /**
   * Returns the redirect for a passed pathname.
   * @param {string} pathname The pathname to check.
   * @return {string|Function|Promise|null}
   */
  getRedirect(pathname) {
    /**
     * Try to make a direct match with the pathname.
     * If we get lucky then we don't have to iterate over the protected patterns.
     */
    let redirect = this.get(pathname);

    /**
     * If we didn't find a direct match then we need to match
     * the given pathname against the protected patters.
     */
    if (!redirect) {
      // Get the protected patterns as an array.
      const patterns = Array.from(this.redirects.keys());
      const [withoutParams] = pathname.split('?');

      // Loop over the patterns until a match is found.
      const patternMatch = patterns.find(pattern => !!this.matcher(pattern)(withoutParams));

      // Match found, set the redirect.
      if (patternMatch) {
        redirect = this.redirects.get(patternMatch);
      }
    }

    return redirect;
  }

  /**
   * @typedef RedirectExtendedData
   * @property {string} matcher The value passed as "from" to set()
   * @property {string|Function|Promise} handler The value passed as "to" to set()
   * @property {Object} pathParams Decoded params from the pathname - defined within the matcher
   * @property {Object} queryParams Decoded query params from the pathname
   */

  /**
   * Unlike "getRedirect" which only returns a matching handler for a passed pathname, this method
   * returns an object that contains some extended data.
   *
   * @param {string} pathname The pathname to check.
   * @returns {RedirectExtendedData}
   */
  getRedirectExtended(pathname) {
    const { url, query } = queryString.parseUrl(pathname);

    // At the fist check if there is a redirect for the pathname
    const redirect = this.getRedirect(url);

    if (!redirect) {
      return null;
    }

    // Retrieve the matching pattern for the redirect from the redirects collection
    const [patternMatch, handlerMatch] = Array.from(this.redirects.entries())
      .find(([, handler]) => handler === redirect) || [];

    const result = null;

    if (patternMatch) {
      // decode params from route patterns (e.g. /item/:productCode)
      const matcherResult = this.matcher(patternMatch)(url);

      return {
        matcher: patternMatch,
        handler: handlerMatch,
        pathParams: matcherResult,
        queryParams: JSON.parse(JSON.stringify(query)),
      };
    }

    return result;
  }

  /**
   * Adds a redirect handler to the collection.
   * @param {string} from The link to redirect from. Route patterns are also supported.
   * @param {string|Function|Promise} to redirect / handle to create a dynamic link.
   * @param {boolean} force Whether or not to forcefully set the redirect.
   */
  set(from = null, to = null, force = false) {
    if (!from || !to) {
      return;
    }

    if (!force && this.redirects.has(from)) {
      return;
    }

    this.redirects.set(from, to);
  }

  /* eslint-disable extra-rules/potential-point-free */

  /**
   * Removes a specified element from the internal "redirects" Map object.
   * @param {string} pathname The pathname to remove.
   */
  unset(pathname) {
    this.redirects.delete(pathname);
  }

  /* eslint-enable extra-rules/potential-point-free */
}

export default new Redirects();
