// TODO: remove or mark as deprecated

/**
 * Class to maintain the image formats
 */
class ProductImageFormats {
  /**
   * Constructor.
   */
  constructor() {
    this.formats = [];
    this.map = new Map();
  }

  /**
   * Returns all formats.
   * @returns {Array}
   */
  getAllUniqueFormats() {
    const hashes = [];
    return Array.from(this.map.values())
      .reduce((prev, val) => [...prev, ...val], [])
      .filter((val) => {
        const hash = JSON.stringify(val);
        if (hashes.indexOf(hash) === -1) {
          hashes.push(hash);
          return true;
        }
        return false;
      });
  }

  /**
   * @param {string} key key of format to get
   * @returns {Object} format
   */
  get(key) {
    return this.map.get(key);
  }

  /**
   * @param {string} key key of format
   * @param {Object} value value of format
   * @returns {Object}
   */
  set(key, value) {
    return this.map.set(key, value);
  }

  /**
   * Removes a format from the list of persisted formats.
   * @param {string} key The key of the format to remove.
   * @returns {ProductImageFormats}
   */
  remove(key) {
    this.map.remove(key);
    return this;
  }
}

export default new ProductImageFormats();
