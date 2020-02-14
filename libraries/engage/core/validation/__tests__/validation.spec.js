import { validate } from '../validation';

describe('engage > core > validation', () => {
  const constraints = {
    email: {
      presence: {
        message: 'validation.required',
        allowEmpty: false,
      },
      email: {
        message: 'validation.email',
      },
    },
    firstName: {
      presence: {
        message: 'validation.required',
        allowEmpty: false,
      },
      format: {
        pattern: '^[a-zA-Z0-9\\u00c4\\u00e4\\u00d6\\u00f6\\u00dc\\u00fc\\u00df\\s]+',
        flags: 'i',
        message: 'validation.alphaNumeric',
      },
    },
  };

  it('should not validate', () => {
    const { valid, validationErrors } = validate({
      firstName: '',
      email: 'mail @ mail',
    }, constraints);

    expect(valid).toEqual(false);
    expect(validationErrors).toEqual({
      firstName: 'validation.required',
      email: 'validation.email',
    });
  });

  it('should validate', () => {
    const { valid, validationErrors } = validate({
      firstName: 'Name',
      email: 'mail@mail.com',
    }, constraints);

    expect(valid).toEqual(true);
    expect(validationErrors).toEqual(undefined);
  });
});
