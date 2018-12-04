/**
 * Class to maintain the image formats
 */
class GalleryImageFormats {
  /**
   * Constructor.
   */
  constructor() {
    this.formats = [];
  }

  /**
   * Returns all formats.
   * @returns {Array}
   */
  getAll() {
    return this.formats;
  }

  /**
   * Sets a new formats to be persisted.
   * @param {string|Array} format The format(s)
   * @returns {PersistedReducers}
   */
  set(format) {
    if (Array.isArray(format)) {
      format.forEach((res) => {
        if (!this.exists(res)) {
          this.formats.push(res);
        }
      });

      return this;
    }

    if (!this.exists(format)) {
      this.formats.push(format);
    }

    return this;
  }

  /**
   * @param {Object} format format to check
   * @returns {boolean} if the format exists in the array
   */
  exists(format) {
    return !!this.formats.filter(res => JSON.stringify(res) === JSON.stringify(format)).length;
  }

  /**
   * Removes a format from the list of persisted formats.
   * @param {string} format The format to remove.
   * @returns {PersistedReducers}
   */
  remove(format) {
    this.formats = this.formats.filter(res => JSON.stringify(res) !== JSON.stringify(format));
    return this;
  }
}

export default new GalleryImageFormats();
