import pathMatch from 'path-match';

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
   * @param {string} pathname The pathname to lookup.
   * @returns {string|Promise|undefined}
   */
  get(pathname) {
    return this.redirects.get(pathname) || null;
  }

  /**
   * Returns the redirect for a passed pathname.
   * @param {string} pathname The pathname to check.
   * @return {string|null}
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
      patterns.some((pattern) => {
        // Check for a match.
        const match = this.matcher(pattern)(withoutParams);

        // Match found, set the redirect.
        if (match) {
          redirect = this.redirects.get(pattern);
        }

        return match;
      });
    }

    return redirect;
  }

  /**
   * @param {string} from The link to redirect from. Route patterns are also supported.
   * @param {string|Function|Promise} to The link to redirect to or a handler to create a dynamic link.
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

  /**
   * @param {string} pathname The pathname to remove.
   */
  unset(pathname) {
    this.redirects.delete(pathname);
  }
}

export default new Redirects();
