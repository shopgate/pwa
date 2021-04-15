import { i18n } from '@shopgate/engage/core';
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
    length: {
      minimum: 8,
      tooShort: i18n.text('validation.minPasswordLength'),
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

const addressConstraints = {
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
};

export const billingConstraints = {
  ...addressConstraints,
};

export const shippingConstraints = {
  ...addressConstraints,
};

/**
 * Generates constraints for the "extra" form.
 * @param {Object} customerAttributes Customer attributes.
 * @returns {Object}
 */
export const generateExtraConstraints = customerAttributes => ({
  ...generateFormConstraints(customerAttributes),
});
