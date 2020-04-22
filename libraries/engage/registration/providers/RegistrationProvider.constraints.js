export const baseConstraints = {
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
  },
};

export const shippingConstraints = {
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
