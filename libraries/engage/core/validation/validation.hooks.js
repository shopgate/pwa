import { useState, useEffect, useCallback } from 'react';
import { validate as validator } from './validation';

/**
 * @param {Object} validationRules The rules.
 * @returns {{ valid: boolean, validationErrors: Object, validate: Function }}
 */
export function useValidation(validationRules) {
  const [valid, setValid] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    setValid(true);
    setValidationErrors({});
  }, [validationRules]);

  const validate = useCallback((values) => {
    const {
      valid: isValid,
      validationErrors: errors,
    } = validator(values, validationRules);

    setValid(isValid);
    setValidationErrors(errors);
  }, [validationRules]);

  return {
    valid,
    validationErrors,
    validate,
  };
}
