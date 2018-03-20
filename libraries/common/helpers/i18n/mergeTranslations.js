import isPlainObject from 'lodash/isPlainObject';
import defaultsDeep from 'lodash/defaultsDeep';

/**
 * Merges two translation objects together.
 * @param {Object} destination The destination object.
 * @param {Object} source The default translations object.
 * @return {Object}
 */
const mergeTranslations = (destination, source) => {
  let extension = {};

  if (isPlainObject(destination)) {
    Object.keys(destination).forEach((key) => {
      if (key.includes(process.env.LOCALE_FILE)) {
        extension = destination[key];
      }
    });
  }

  return defaultsDeep(extension, source);
};

export default mergeTranslations;
