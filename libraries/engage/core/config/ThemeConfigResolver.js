/* eslint-disable class-methods-use-this */
import get from 'lodash/get';
import appConfig, { writeToConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * Parses a JSON object and resolves placeholders with values from the object.
 */
export class ThemeConfigResolver {
  /**
   * @param {Object} config The configuration to resolve references for.
   * @param {string} [delimiter='$.'] What the replaceable starts with.
   * @constructor
   */
  constructor(config = {}, delimiter = '$.') {
    this.config = config;
    this.delimiter = delimiter;
  }

  /**
   * Resolves the JSON configuration.
   * @returns {Object}
   */
  resolve() {
    if (!this.configIsFilled()) {
      return this.config;
    }

    return this.processObject(this.config);
  }

  /**
   * Takes the current theme config and resolves all page- and widget-setting refs
   */
  resolveAll() {
    this.config = appConfig.theme;
    writeToConfig({ theme: this.resolve() });
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
    // Replace all variable references in the given string if any exist
    let value = input;
    const preRegex = new RegExp(`.*${
      // Escape delimiter to use within another reg exp.
      this.delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }`, 'g');
    const postRegex = new RegExp(/[^a-zA-Z0-9_$.].*$/, 'g');
    while (value.includes(this.delimiter)) {
      // Get next reference
      const path = value.replace(preRegex, '').replace(postRegex, '');

      // replace reference (including its delimiter) with the actual value
      value = value.replace(`${this.delimiter}${path}`, get(this.config, path));
    }

    return value;
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
