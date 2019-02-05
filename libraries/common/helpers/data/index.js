import { isObject } from '../validation';

/**
 * Remove the first element of the array.
 * @param {Array} array The array to remove the first element from.
 * @returns {Array} The reduced array.
 */
export const shift = ([, ...newArray]) => newArray;

/**
 * Returns a new object without certain keys.
 * @param {Object} obj The original object.
 * @param {Array} [keys=[]] An array of unwanted keys.
 * @return {Object} The reduced object.
 */
export const objectWithoutProps = (obj, keys = []) => {
  const target = {};

  Object.keys(obj).forEach((key) => {
    if (!keys.includes(key)) {
      target[key] = obj[key];
    }
  });

  return target;
};

/**
 * Checks if a URL is an external URL.
 * @param {string} url The URL to check.
 * @return {boolean}
 */
export const isExternal = url =>
  url.includes('http://') || url.includes('https://') || url.includes('//');

/**
 * Returns the actual url to the image, by adding url parameters with the dimensions for img-cdn
 * @param {string} src Source to the image.
 * @param {Object} dimension Dimension of the requested image.
 * @param {number} dimension.width Width in pixels.
 * @param {number} dimension.height Height in pixels.
 * @returns {string}
 */
export const getActualImageSource = (src, { width, height }) => {
  if (src && src.startsWith('https://img-cdn.shopgate.com') && !src.includes('?')) {
    return `${src}?w=${width}&h=${height}&q=70&zc=resize&fillc=FFFFFF`;
  }
  return src;
};

/**
 * Finds the index of a property inside an array.
 * @param {Array} arr The array to check.
 * @param {Function} fn The callback function to filter inside the array.
 * @return {number} The index of the property.
 */
export const findIndex = (arr, fn) => {
  if (Array.isArray(arr)) {
    for (let i = 0; i < arr.length; i += 1) {
      if (fn(arr[i])) {
        return i;
      }
    }
  }

  return -1;
};

/**
 * Convert binary data into hexadecimal representation
 * @param {string|number} str The string that shall be encoded
 * @see http://locutus.io/php/strings/bin2hex/
 * @return {string} The hexadecimal representation of the given string
 */
export const bin2hex = (str) => {
  const s = `${str}`;

  let i;
  let l;
  let o = '';
  let n;

  for (i = 0, l = s.length; i < l; i += 1) {
    n = s.charCodeAt(i).toString(16);
    o += n.length < 2 ? `0${n}` : n;
  }

  return o;
};

/**
 * Decodes a hexadecimal encoded binary string
 * @param {string} str The string that shall be decoded
 * @see http://locutus.io/php/strings/hex2bin/
 * @returns {string|boolean} Hexadecimal representation of data. FALSE if decoding failed.
 */
export const hex2bin = (str) => {
  const s = `${str}`;

  const ret = [];
  let i = 0;
  let l;

  for (l = s.length; i < l; i += 2) {
    const c = parseInt(s.substr(i, 1), 16);
    const k = parseInt(s.substr(i + 1, 1), 16);

    if (Number.isNaN(c) || Number.isNaN(k)) {
      return false;
    }

    // eslint-disable-next-line no-bitwise
    ret.push((c << 4) | k);
  }

  // eslint-disable-next-line prefer-spread
  return String.fromCharCode.apply(String, ret);
};

/**
 * Compares two strings of object keys for object sorting.
 * @param {string} a The first key.
 * @param {string} b The second key.
 * @return {number} The sort order.
 */
const defaultKeySortFn = (a, b) => a.localeCompare(b);

/**
 * Deep sorts an object by its keys.
 * @param {Object} src The object to sort.
 * @param {Function} [comparator=defaultKeySortFn] The sorting operator callback.
 * @return {Object} The sorted object.
 */
export const sortObject = (src, comparator = defaultKeySortFn) => {
  if (Array.isArray(src)) {
    return src.map(item => sortObject(item, comparator));
  }

  if (isObject(src)) {
    return Object.keys(src)
      .sort(comparator)
      .reduce(
        (obj, key) => ({
          ...obj,
          [key]: sortObject(src[key], comparator),
        }),
        {}
      );
  }

  return src;
};

/**
 * Transforms widget display options to match pipeline specifications.
 * @param {string} displayOptions The display options as specified by the widget settings.
 * @returns {string} The transformed string compatible with the pipeline requests.
 */
export const transformDisplayOptions = (displayOptions) => {
  switch (displayOptions) {
    case 'relevance_asc':
    case 'relevance_desc':
      return 'relevance';
    case 'price_asc':
      return 'priceAsc';
    case 'price_desc':
      return 'priceDesc';
    case 'name_asc':
      return 'nameAsc';
    case 'name_desc':
      return 'nameDesc';
    default:
      return displayOptions;
  }
};

/**
 * Validates all parameters. The selector will return null if one parameter is invalid.
 * @param {Function} selector The original selector.
 * @param {Object} [defaultResult] The result when the selector fails.
 * @return {Function}
 */
export const validateSelectorParams = (selector, defaultResult = null) => (...params) => {
  if (params.some(param => param === null || typeof param === 'undefined')) {
    return defaultResult;
  }

  return selector(...params);
};
