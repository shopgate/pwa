export default {
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
