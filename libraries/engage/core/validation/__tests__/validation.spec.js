import {
  VALIDATION_EMAIL,
  VALIDATION_REQUIRED,
  validationErrors as constValidationErrors,
} from '../validation.constants';
import { validate } from '../validation';

describe('engage > core > validation > hooks', () => {
  it('should not validate', () => {
    const { valid, validationErrors } = validate({
      firstName: '',
      email: 'mail @ mail',
    }, {
      firstName: VALIDATION_REQUIRED,
      email: [VALIDATION_REQUIRED, VALIDATION_EMAIL],
    });

    expect(valid).toEqual(false);
    expect(validationErrors).toEqual({
      firstName: constValidationErrors[VALIDATION_REQUIRED],
      email: constValidationErrors[VALIDATION_EMAIL],
    });
  });
  it('should validate', () => {
    const { valid, validationErrors } = validate({
      firstName: 'Name',
      email: 'mail@mail.com',
    }, {
      firstName: VALIDATION_REQUIRED,
      email: [VALIDATION_REQUIRED, VALIDATION_EMAIL],
    });

    expect(valid).toEqual(true);
    expect(validationErrors).toEqual({});
  });
});
