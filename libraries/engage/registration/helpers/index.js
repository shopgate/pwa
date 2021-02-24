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
    const { path = [], code } = error;
    const { subentityPath = [] } = error;

    let { message } = error;

    if (path.length === 0 && subentityPath.length === 0) {
      result.general.push(error);
      return result;
    }

    if (path.length > 0) {
      message = i18n.text('validation.checkField');
      setWith(result.validation, path.slice(2).join('.'), message, Object);
    } else if (subentityPath.length > 0) {
      const field = subentityPath[subentityPath.length - 1];

      if (code === 409 && field === 'emailAddress') {
        message = i18n.text('validation.emailConflict');
      } else {
        message = i18n.text('validation.checkField');
      }

      setWith(result.validation, subentityPath.join('.'), message, Object);
    }

    return result;
  }, {
    validation: {},
    general: [],
  });

  return converted;
};
