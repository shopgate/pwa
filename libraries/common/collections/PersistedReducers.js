/**
 * Class to maintain the persisted redux reducers.
 */
class PersistedReducers {
  /**
   * Constructor.
   */
  constructor() {
    this.reducers = [];
  }

  /**
   * Returns all reducers.
   * @return {Array}
   */
  getAll() {
    return this.reducers;
  }

  /**
   * Sets a new reducers to be persisted.
   * @param {string|Array} reducer The name of the reducer to persist.
   * @return {PersistedReducers}
   */
  set(reducer) {
    if (Array.isArray(reducer)) {
      reducer.forEach((red) => {
        if (!this.reducers.includes(red)) {
          this.reducers.push(red);
        }
      });

      return this;
    }

    if (this.reducers.includes(reducer)) {
      return this;
    }

    this.reducers.push(reducer);
    return this;
  }

  /**
   * Removes a reducer from the list of persisted reducers.
   * @param {string} reducer The name of the reducer to remove.
   * @return {PersistedReducers}
   */
  remove(reducer) {
    this.reducers = this.reducers.filter(red => (red !== reducer));
    return this;
  }
}

export default new PersistedReducers();
