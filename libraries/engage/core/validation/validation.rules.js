import {
  VALIDATION_ALPHANUMERIC,
  VALIDATION_EMAIL,
  VALIDATION_NUMERIC, VALIDATION_PHONE,
  VALIDATION_REQUIRED,
} from './validation.constants';

/**
 * @mixin
 */
export const validationRules = {
  [VALIDATION_REQUIRED]: value => !!value,
  [VALIDATION_EMAIL]: value => (
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
  ),
  [VALIDATION_NUMERIC]: value => /^\d+$/.test(value),
  [VALIDATION_ALPHANUMERIC]: value => /^[a-zA-Z0-9 ]+$/.test(value),
  [VALIDATION_PHONE]: value => /^[+0-9]+$/.test(value),
};
