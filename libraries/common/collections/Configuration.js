import logGroup from '@shopgate/pwa-core/helpers/logGroup';

/**
 * Class to maintain different configurations
 */
class Configuration {
  /**
   * Constructor
   */
  constructor() {
    this.store = new Map();
  }

  /**
   * Get a config value
   * @param {*} key config key
   * @param {*} defaultValue defaultValue
   * @returns {*|undefined}
   */
  get(key, defaultValue) {
    return this.store.get(key) || defaultValue;
  }

  /**
   * Sets a configuration.
   * @param {*} key key
   * @param {*} value value
   * @returns {Configuration}
   */
  set(key, value) {
    this.store.set(key, value);
    return this;
  }

  /**
   * Update config with given callback function
   * @param {*} key key
   * @param {Function} updater function to update value
   * @returns {Configuration}
   */
  update(key, updater) {
    if (typeof updater !== 'function') {
      logGroup('CONFIGURATION%c updater is not function', { key }, '#e0061e');
      return this;
    }
    const prevValue = this.store.get(key);
    const newValue = updater(this.store.get(key));

    // eslint-disable-next-line extra-rules/no-single-line-objects
    logGroup('CONFIGURATION%c changed', { key, prevValue, newValue }, '#069215');
    return this.set(key, newValue);
  }
}

/** @type {Configuration} */
export default new Configuration();
