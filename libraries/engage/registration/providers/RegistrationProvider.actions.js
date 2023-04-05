import {
  EVALIDATION,
  getRegistrationMode,
  SHOP_SETTING_REGISTRATION_MODE_SIMPLE,
} from '@shopgate/engage/core';
import {
  extractAttributes,
  convertPipelineValidationErrors,
} from '@shopgate/engage/account/helper/form';
import { getMerchantCustomerAttributes } from '@shopgate/engage/core/selectors/merchantSettings';
import { submitRegistration as submit } from '../actions';

/**
 * Submits registration form data.
 * @param {Object} baseFormData Data from the base form
 * @param {Object} shippingFormData Data from the shipping form
 * @param {Object} additionalData Additional data for the request.
 * @returns {Function}
 */
export const submitRegistration = ({
  baseFormData, billingFormData, shippingFormData, additionalFormData,
}) => async (dispatch, getState) => {
  const customerAttributes = getMerchantCustomerAttributes(getState());
  const registrationMode = getRegistrationMode(getState());
  const { marketingOptIn, ...attributeData } = additionalFormData;
  const attributes = extractAttributes(customerAttributes, attributeData);

  const { emailAddress, password } = baseFormData;
  let firstName;
  let lastName;

  if (registrationMode === SHOP_SETTING_REGISTRATION_MODE_SIMPLE) {
    ({ firstName, lastName } = baseFormData);
  } else {
    ({ firstName, lastName } = billingFormData);
  }

  const customer = {
    firstName,
    lastName,
    emailAddress,
    password,
    attributes,
    settings: {
      marketingOptIn,
    },
  };

  if (registrationMode !== SHOP_SETTING_REGISTRATION_MODE_SIMPLE) {
    // No contacts creation at "simple" registration mode
    customer.contacts = [{
      ...billingFormData,
      emailAddress,
      isDefaultBilling: true,
      isDefaultShipping: !shippingFormData,
    }, ...(shippingFormData ? [{
      ...shippingFormData,
      emailAddress,
      isDefaultBilling: false,
      isDefaultShipping: true,
    }] : [])];
  }

  let errors;

  try {
    await dispatch(submit(customer));
  } catch ({ code, errors: validationErrors }) {
    if (code === EVALIDATION) {
      errors = validationErrors;
    }
  }

  const converted = convertPipelineValidationErrors(errors, attributes);

  if (converted?.validation && Object.keys(converted.validation).length > 0) {
    const { emailAddress: errEmailAddress, password: errPassword } = converted.validation;
    const billing = converted?.validation?.contacts?.['0'] || {};
    const shipping = converted?.validation?.contacts?.['1'] || {};
    const extra = converted?.validation?.attributes || {};

    return {
      errors: {
        baseFormData: {
          ...(errEmailAddress ? { emailAddress: errEmailAddress } : {}),
          ...(errPassword ? { password: errPassword } : {}),
        },
        billingFormData: {
          ...billing,
        },
        shippingFormData: {
          ...shipping,
        },
        extraFormData: {
          ...extra,
        },
      },
    };
  }

  return null;
};
