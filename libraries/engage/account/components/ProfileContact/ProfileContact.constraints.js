/**
 * Generates form constraints.
 * @param {boolean} isCheckout Whether the form is shown within the checkout process
 * @returns {Object}
 */
export const generateConstraints = (isCheckout = false) => ({
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
  ...(!isCheckout ? {
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
  } : {}),
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
});

export default generateConstraints;
