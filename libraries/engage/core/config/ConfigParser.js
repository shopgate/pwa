/* eslint-disable class-methods-use-this */
import get from 'lodash/get';

/**
 * Parses a JSON object and replaces placeholders with values from the object.
 */
export class ConfigParser {
  /**
   * @param {Object} config The configuration to parse.
   * @param {string} [delimiter='$.'] What the replaceable starts with.
   * @constructor
   */
  constructor(config = {}, delimiter = '$.') {
    this.config = config;
    this.delimiter = delimiter;
  }

  /**
   * Parses the JSON configuration.
   * @returns {Object}
   */
  parse() {
    if (!this.configIsFilled()) {
      return this.config;
    }

    return this.processObject(this.config);
  }

  /**
   * Checks whether the config has any keys.
   * @returns {boolean}
   */
  configIsFilled() {
    return (Object.keys(this.config).length > 0);
  }

  /**
   * @param {Object} input The input object to process.
   * @returns {Object}
   */
  processObject(input) {
    const output = {};

    Object.keys(input).forEach((key) => {
      const item = input[key];
      if (this.isObject(item)) {
        output[key] = this.processObject(item);
        return;
      }

      if (Array.isArray(item)) {
        output[key] = this.processArray(item);
        return;
      }

      if (this.isString(item)) {
        output[key] = this.processString(item);
        return;
      }

      output[key] = item;
    });

    return output;
  }

  /**
   * @param {Array} input The input array to process.
   * @returns {Array}
   */
  processArray(input) {
    return input.map((item) => {
      if (this.isObject(item)) {
        return this.processObject(item);
      }

      if (Array.isArray(item)) {
        return this.processArray(item);
      }

      if (this.isString(item)) {
        return this.processString(item);
      }

      return item;
    });
  }

  /**
   * @param {string} input The input string to process.
   * @returns {string}
   */
  processString(input) {
    if (!input.startsWith(this.delimiter)) {
      return input;
    }

    return get(this.config, input.replace(this.delimiter, ''));
  }

  /**
   *  Checks whether the props is a string.
   * @param {*} prop The property to check.
   * @returns {boolean}
   */
  isString(prop) {
    return typeof prop === 'string';
  }

  /**
   * Whether the prop is an object.
   * @param {*} prop The prop to test.
   * @returns {boolean}
   */
  isObject(prop) {
    return (typeof prop === 'object') && (prop !== null) && (prop.constructor === Object);
  }
}
/* eslint-enable class-methods-use-this */
