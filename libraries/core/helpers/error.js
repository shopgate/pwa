/**
 * Describes a value without its content, since it can be personal data.
 * @param {*} value The value.
 * @returns {string} Primitives and errors as text, objects as their keys and their error code.
 */
export const describeValue = (value) => {
  if (Array.isArray(value)) {
    return `[${value.map(describeValue).join(', ')}]`;
  }

  if (!value || typeof value !== 'object' || value instanceof Error) {
    return String(value);
  }

  const code = typeof value.code === 'string' ? `code: "${value.code}", ` : '';

  return `{${code}keys: ${Object.keys(value).join(', ')}}`;
};

/**
 * Defines properties on an error itself, so that they also replace properties the error only
 * has a getter for.
 * @param {Error} error The error.
 * @param {Object} properties The properties to add.
 * @returns {Error} The error.
 */
const defineProperties = (error, properties) => {
  Object.keys(properties).forEach((key) => {
    Object.defineProperty(error, key, {
      value: properties[key],
      writable: true,
      enumerable: true,
      configurable: true,
    });
  });

  return error;
};

/**
 * Turns a thrown value into an error and adds properties to it. It never throws.
 * @param {*} thrown The thrown value.
 * @param {Object} [properties={}] The properties to add.
 * @returns {Error} The value itself when it is an error that takes the properties, otherwise an
 * error that describes it.
 */
export const toError = (thrown, properties = {}) => {
  /**
   * @returns {Error} A new error that describes the thrown value.
   */
  const describeThrown = () => defineProperties(new Error(describeValue(thrown)), properties);

  if (!(thrown instanceof Error)) {
    return describeThrown();
  }

  try {
    return defineProperties(thrown, properties);
  } catch (error) {
    return describeThrown();
  }
};
