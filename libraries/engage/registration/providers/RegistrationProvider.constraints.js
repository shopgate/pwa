import { SHOP_SETTING_REGISTRATION_MODE_EXTENDED } from '@shopgate/engage/core';
import { generateFormConstraints } from '@shopgate/engage/account/helper/form';

/**
 * @returns {Object}
 */
export const generateBaseConstraints = () => ({
  emailAddress: {
    presence: {
      message: 'validation.required',
      allowEmpty: false,
    },
    email: {
      message: 'validation.email',
    },
  },
  password: {
    presence: {
      message: 'validation.required',
      allowEmpty: false,
    },
  },
  passwordConfirm: {
    presence: {
      message: 'validation.required',
      allowEmpty: false,
    },
    equality: {
      attribute: 'password',
      message: 'validation.passwordMismatch',
      comparator: (v1, v2) => JSON.stringify(v1) === JSON.stringify(v2),
    },
  },
});

/**
 * Helper to generate address constraints
 * @param {Object} params Options for the helper
 * @param {string} params.registrationMode Current active registration mode
 * @returns {Object}
 */
const generateAddressConstraints = ({
  registrationMode = SHOP_SETTING_REGISTRATION_MODE_EXTENDED,
}) => ({
  firstName: {
    presence: {
      message: 'validation.required',
      allowEmpty: false,
    },
  },
  lastName: {
    presence: {
      message: 'validation.required',
      allowEmpty: false,
    },
  },
  ...(registrationMode === SHOP_SETTING_REGISTRATION_MODE_EXTENDED) ? {
    address1: {
      presence: {
        message: 'validation.required',
        allowEmpty: false,
      },
    },
    city: {
      presence: {
        message: 'validation.required',
        allowEmpty: false,
      },
    },
    country: {
      presence: {
        message: 'validation.required',
        allowEmpty: false,
      },
    },
    postalCode: {
      presence: {
        message: 'validation.required',
        allowEmpty: false,
      },
    },
    mobile: {
      presence: {
        message: 'validation.required',
        allowEmpty: false,
      },
      format: {
        pattern: '^[+0-9]+',
        message: 'validation.mobileNumber',
      },
    },
  } : null,
});

/**
 * Helper to generate billing form constraints
 * @param {Object} params Options for the helper
 * @param {string} [params.registrationMode] Current active registration mode
 * @returns {Object}
 */
export const generateBillingConstraints = ({
  registrationMode = SHOP_SETTING_REGISTRATION_MODE_EXTENDED,
}) => generateAddressConstraints({ registrationMode });

/**
 * Helper to generate shipping form constraints
 * @param {Object} params Options for the helper
 * @param {string} [params.registrationMode] Current active registration mode
 * @returns {Object}
 */
export const generateShippingConstraints = ({
  registrationMode = SHOP_SETTING_REGISTRATION_MODE_EXTENDED,
}) => (registrationMode === SHOP_SETTING_REGISTRATION_MODE_EXTENDED
  // Only at "extended" mode there will be constraints for the shipping form since "simple" has no
  // shipping form.
  ? generateAddressConstraints({ registrationMode })
  : {});

/**
 * Generates constraints for the "extra" form.
 * @param {Object} customerAttributes Customer attributes.
 * @returns {Object}
 */
export const generateExtraConstraints = customerAttributes => ({
  ...generateFormConstraints(customerAttributes),
});
