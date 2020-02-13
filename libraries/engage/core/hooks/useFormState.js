import { useState, useEffect } from 'react';
import { useValidation } from '../validation';

/**
 * @param {Object} initialState The initial form state.
 * @param {Function} complete The completion callback.
 * @param {Object} validationRules validationRules
 * @returns {{ handleChange, handleSubmit, values, valid, validationErrors }}
 */
export function useFormState(initialState, complete, validationRules = {}) {
  const [values, setValues] = useState(initialState);
  const [isSubmitting, setSubmitting] = useState(false);
  const [changed, setChanged] = useState(false);
  const { valid, validationErrors, validate } = useValidation(validationRules);

  // -- CHANGED ---------------
  useEffect(() => {
    const isEqual = JSON.stringify(values) === JSON.stringify(initialState);

    if (!isEqual && !changed) {
      setChanged(true);
    } else if (isEqual && changed) {
      setChanged(false);
    }
  }, [changed, initialState, values]);

  // -- IS_SUBMITTING ---------
  useEffect(() => {
    if (!isSubmitting) {
      return;
    }
    if (valid) {
      complete(values);
    }

    setChanged(false);
    setSubmitting(false);
  }, [complete, isSubmitting, values, valid]);

  // -- VALIDATION ---------
  useEffect(() => {
    if (!changed) {
      return;
    }
    validate(values);
  }, [changed, validate, values]);

  /**
   * @param {string} sanitized The sanitized field value.
   * @param {Object} event The change event object.
   */
  function handleChange(sanitized, event) {
    if (!event) {
      return;
    }

    setValues({
      ...values,
      [event.target.name]: sanitized,
    });
  }

  /**
   * @param {Object} event The submit event object.
   */
  function handleSubmit(event) {
    event.preventDefault();
    validate(values);
    setSubmitting(true);
  }

  return {
    handleChange,
    handleSubmit,
    values,
    valid,
    validationErrors,
  };
}
