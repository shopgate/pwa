import { validationRules } from '../validation.rules';
import {
  VALIDATION_ALPHANUMERIC,
  VALIDATION_EMAIL,
  VALIDATION_NUMERIC, VALIDATION_PHONE,
  VALIDATION_REQUIRED,
} from '../validation.constants';

describe('engage > core > validation > rules', () => {
  it('should validate required', () => {
    expect(validationRules[VALIDATION_REQUIRED]('')).toEqual(false);
    expect(validationRules[VALIDATION_REQUIRED]('string')).toEqual(true);
  });

  it('should validate email', () => {
    expect(validationRules[VALIDATION_EMAIL]('mail @mail.com')).toEqual(false);
    expect(validationRules[VALIDATION_EMAIL]('mail@mail.com')).toEqual(true);
  });

  it('should validate numeric', () => {
    expect(validationRules[VALIDATION_NUMERIC]('mail @mail.com')).toEqual(false);
    expect(validationRules[VALIDATION_NUMERIC]('100')).toEqual(true);
  });
  it('should validate alpha numeric', () => {
    expect(validationRules[VALIDATION_ALPHANUMERIC]('123 qw ^%$')).toEqual(false);
    expect(validationRules[VALIDATION_ALPHANUMERIC]('123 qwerty')).toEqual(true);
  });

  it('should validate tel number', () => {
    expect(validationRules[VALIDATION_PHONE]('tel number')).toEqual(false);
    expect(validationRules[VALIDATION_PHONE]('+1234567890')).toEqual(true);
  });
});
