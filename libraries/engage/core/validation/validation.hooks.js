import { useState, useEffect, useCallback } from 'react';
import { validate as validator } from './validation';

/**
 * @param {Object} constraints The rules.
 * @returns {{ valid: ?boolean, validationErrors: ?Object, validate: Function }}
 */
export function useValidation(constraints) {
  const [valid, setValid] = useState(null);
  const [validationErrors, setValidationErrors] = useState(undefined);

  useEffect(() => {
    setValid(null);
    setValidationErrors(undefined);
  }, [constraints]);

  const validate = useCallback((values) => {
    const {
      valid: isValid,
      validationErrors: errors,
    } = validator(values, constraints);

    setValid(isValid);
    setValidationErrors(errors);
  }, [constraints]);

  return {
    valid,
    validationErrors,
    validate,
  };
}
