/**
 * The Redirects class.
 */
class Redirects {
  /**
   * The constructor.
   */
  constructor() {
    this.redirects = new Map();
  }

  /**
   * @param {string} pathname The pathname to lookup.
   * @returns {string | undefined}
   */
  get(pathname) {
    return this.redirects.get(pathname);
  }

  /**
   * @param {string} from The link to redirect from.
   * @param {string} to The link to redirect to.
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
