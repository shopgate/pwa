export const VALIDATION_REQUIRED = 1;
export const VALIDATION_EMAIL = 2;
export const VALIDATION_NUMERIC = 4;
export const VALIDATION_ALPHANUMERIC = 8;
export const VALIDATION_PHONE = 16;

/**
 * @mixin
 */
export const validationErrors = {
  [VALIDATION_REQUIRED]: 'validation.required',
  [VALIDATION_EMAIL]: 'validation.email',
  [VALIDATION_NUMERIC]: 'validation.numeric',
  [VALIDATION_ALPHANUMERIC]: 'validation.alphaNumeric',
  [VALIDATION_PHONE]: 'validation.mobileNumber',
};
