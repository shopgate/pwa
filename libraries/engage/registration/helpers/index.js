/**
 * Converts validation errors from the shopgate.user.register pipeline
 * @param {Array} errors The errors
 * @returns {Object|null}
 */
export const convertSubmitRegistrationValidationErrors = (errors) => {
  if (!Array.isArray(errors) || errors.length === 0) {
    return null;
  }

  const converted = errors.reduce((result, error) => {
    const { subentityPath, message } = error;
    const [, index, field] = subentityPath;
    /* eslint-disable no-param-reassign */
    if (!result[index]) {
      result[index] = {};
    }

    result[index][field] = message;
    /* eslint-enable no-param-reassign */
    return result;
  }, {});

  return converted;
};
