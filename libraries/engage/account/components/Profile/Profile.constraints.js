export default customerAttributes => ({
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
  ...Object.assign({}, ...customerAttributes.map((attribute) => {
    if (!attribute.isRequired) {
      return {};
    }
    return {
      [`attribute_${attribute.code}`]: {
        presence: {
          message: 'validation.required',
          allowEmpty: false,
        },
      },
    };
  })),
});
