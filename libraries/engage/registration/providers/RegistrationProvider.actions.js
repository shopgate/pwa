import { EVALIDATION } from '@shopgate/engage/core';
import { submitRegistration as submit } from '../actions';
import { convertSubmitRegistrationValidationErrors } from '../helpers';

/**
 * Submits registration form data.
 * @param {Object} baseFormData Data from the base form
 * @param {Object} shippingFormData Data from the shipping form
 * @param {Object} additionalData Additional data for the request.
 * @returns {Function}
 */
export const submitRegistration = (
  baseFormData,
  shippingFormData,
  additionalData
) => async (dispatch) => {
  const contacts = [{
    ...baseFormData,
    ...shippingFormData,
    isDefaultShipping: true,
    isDefaultBilling: true,
  }];

  let errors;

  try {
    await dispatch(submit(contacts, additionalData));
  } catch ({ code, errors: validationErrors }) {
    if (code === EVALIDATION) {
      errors = validationErrors;
    }
  }

  const converted = convertSubmitRegistrationValidationErrors(errors);

  if (converted) {
    const {
      emailAddress, password, passwordConfirm, ...rest
    } = converted[0];

    return {
      errors: {
        baseFormData: {
          ...(emailAddress ? { emailAddress } : {}),
          ...(password ? { password } : {}),
          ...(passwordConfirm ? { passwordConfirm } : {}),
        },
        shippingFormData: {
          ...rest,
        },
      },
    };
  }

  return null;
};
