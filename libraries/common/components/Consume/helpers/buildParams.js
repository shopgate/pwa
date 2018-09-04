import get from 'lodash/get';

/**
 * Searches an object for the given paths.
 * Returns a new object with the values found at the end of each path.
 * @param {Object} obj The object to look through.
 * @param {Object} paths A set of paths to find inside the object.
 * @returns {Object}
 */
const buildParams = (obj, paths) => {
  const params = {};

  Object.entries(paths).forEach(([prop, path]) => {
    const value = get(obj, path);
    params[prop] = (typeof value !== 'undefined') ? value : null;
  });

  return params;
};

export default buildParams;
