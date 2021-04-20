import { generateFormConstraints } from '@shopgate/engage/account/helper/form';

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

const reserveOnlyConstraints = {
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

/**
 * Generates constraints for the "billing" form.
 * @param {boolean} [reserveOnly=false] Whether the order is reserve only
 * @returns {Object}
 */
export const generateBillingConstraints = (reserveOnly = false) => ({
  ...(reserveOnly ? {
    ...reserveOnlyConstraints,
  } : { ...addressConstraints }),
  emailAddress: {
    presence: {
      message: 'validation.required',
      allowEmpty: false,
    },
    email: {
      message: 'validation.email',
    },
  },
});

/**
 * Generates constraints for the "shipping" form.
 * @returns {Object}
 */
export const generateShippingConstraints = () => ({ ...addressConstraints });

/**
 * Generates constraints for the "extra" form.
 * @param {Object} customerAttributes Customer attributes.
 * @returns {Object}
 */
export const generateExtraConstraints = customerAttributes => ({
  ...generateFormConstraints(customerAttributes),
});

/**
 * Generates constraints for the "pickup" form.
 * @returns {Object}
 */
export const generatePickupConstraints = () => ({
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
  emailAddress: {
    presence: {
      message: 'validation.required',
      allowEmpty: false,
    },
    email: {
      message: 'validation.email',
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
});

/**
 * Generates constraints for the "pickup" form at self pickup.
 * @returns {Object}
 */
export const generateSelfPickupConstraints = () => ({});
