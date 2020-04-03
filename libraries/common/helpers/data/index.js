import { logger } from '@shopgate/pwa-core/helpers';
import { isAndroid } from '@shopgate/pwa-core';
import { getThemeSettings } from '@shopgate/engage/core/config/getThemeSettings';
import { isObject, isArray } from '../validation';

/**
 * Tests if the prop is an object or an array.
 * @param {*} prop The property to test.
 * @return {boolean}
 */
const isObjectOrArray = prop => isObject(prop) || isArray(prop);

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
  if (src && src.includes('images.shopgate.services/v2/images')) {
    const { fillColor = 'FFFFFF' } = getThemeSettings('AppImages') || {};
    const format = isAndroid ? 'webp' : 'jpeg';

    return `${src}&format=${format}&width=${width}&height=${height}&quality=75&fill=${fillColor.replace('#', '')}`;
  }

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

/**
 * @callback ArrayItemComparator
 * @param {string} path
 * @param {*} prev
 * @param {*} next
 * @param {number} prevIndex
 * @param {number} nextIndex
 * @returns {boolean}
 */
/**
 * Takes a destination object and a source and merges the source object into the destination.
 * Differing properties will replaced. References are kept where possible.
 * @param {Object} destination Object to mutate
 * @param {Object} source Object which contains the properties to assign to the destination
 * @param {boolean} [warn] Enables log output on mismatching types. Defaults to 'true'.
 * @param {ArrayItemComparator|null} [arrayComparator] Defines how to compare array items.
 * @param {string} [path] Path that specifies the position of a given merge within the object tree.
 */
export function assignObjectDeep(
  destination,
  source,
  warn = true,
  arrayComparator = null,
  path = ''
) {
  // Avoids eslint warning on param mutation, which is necessary
  const dest = destination;
  const src = source;

  // Don't do anything when types are scalar (can occur in recursion)
  if (typeof dest !== 'object' || typeof src !== 'object') {
    return;
  }

  Object.keys(src).forEach((key) => {
    const keyPath = `${path}.${key}`.replace(/^\./, '');

    const prop = src[key];
    if (!isObjectOrArray(dest[key]) || !isObjectOrArray(prop)) {
      // output a warning if only one of both is an object (undefined dest is fine -> no warning)
      if (warn && dest[key] !== undefined
        && (!isObjectOrArray(dest[key]) ? isObjectOrArray(prop) : !isObjectOrArray(prop))) {
        logger.warn('Trying to merge object properties with mixed object types: ', prop, dest[key]);
      }

      // Overwrite always if one of the props is not an object or array
      dest[key] = prop;
      return;
    }

    // Both structures are objects but one or both can be an array
    if (isArray(prop) && isArray(dest[key])) {
      // Try to keep reference of as many array items as possible
      prop.forEach((element, destIndex) => {
        const itemPath = `${keyPath}.${destIndex}`;
        // Check if a maching array item exists for merging
        const existing = dest[key].find((prev, prevIndex) =>
          arrayComparator(itemPath, prev, element, prevIndex, destIndex));

        // Merge into existing if found or add to array otherwise
        if (existing !== undefined) {
          // Scalar types can't be merged and will be ignored when an equal exists
          assignObjectDeep(existing, element, warn, arrayComparator, itemPath);
        } else {
          dest[key].push(element);
        }
      });
    } else if (!isArray(prop) && !isArray(dest[key])) {
      // Merge objects
      assignObjectDeep(dest[key], prop, warn, arrayComparator, keyPath);
    } else {
      // Object types differ, print a warning
      if (warn) {
        logger.warn('Merging object properties with mixed object types: ', prop, dest[key]);
      }

      dest[key] = prop;
    }
  });
}
