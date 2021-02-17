import setWith from 'lodash/setWith';
import { i18n } from '@shopgate/engage/core';

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
    const { path, code } = error;
    let { subentityPath } = error;

    let { message } = error;

    if (path) {
      message = i18n.text('validation.checkField');
      setWith(result, path.slice(2).join('.'), message, Object);
    } else if (subentityPath) {
      if (code === 409) {
        message = i18n.text('validation.emailConflict');
        subentityPath = ['emailAddress'];
      } else {
        message = i18n.text('validation.checkField');
      }

      setWith(result, subentityPath.join('.'), message, Object);
    }

    return result;
  }, {});

  return converted;
};
