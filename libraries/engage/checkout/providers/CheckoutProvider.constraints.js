export const pickupConstraints = {
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
  instructions: {
    presence: {
      message: 'validation.required',
      allowEmpty: false,
    },
  },
  cellPhone: {
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
