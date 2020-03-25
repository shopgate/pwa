import { useState, useEffect, useCallback } from 'react';
import { useValidation } from '../validation';

/**
 * @param {Object} initialState The initial form state.
 * @param {Function} complete The completion callback.
 * @param {Object} validationConstraints validationConstraints
 * @returns {{ handleChange, handleSubmit, values, valid, validationErrors: ?Object }}
 */
export function useFormState(initialState, complete, validationConstraints = {}) {
  const [values, setValues] = useState(initialState);
  const [isSubmitting, setSubmitting] = useState(false);
  const [changed, setChanged] = useState(false);
  const { valid, validationErrors, validate } = useValidation(validationConstraints);

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
    if (valid === true) {
      complete(values);
      setChanged(false);
      setSubmitting(false);
    }
  }, [complete, isSubmitting, values, valid]);

  // -- VALIDATION ON SUBMIT ---------
  useEffect(() => {
    // Yest no validation on submit
    if (changed) {
      validate(values);
    }
    if (isSubmitting && valid === null) {
      validate(values);
    }
    if (isSubmitting && valid === false) {
      setSubmitting(false);
    }
  }, [changed, validate, values, isSubmitting, valid]);

  /**
   * @param {string} sanitized The sanitized field value.
   * @param {Object} event The change event object.
   */
  const handleChange = useCallback((sanitized, event) => {
    if (!event) {
      return;
    }

    setValues({
      ...values,
      [event.target.name]: sanitized,
    });
  }, [values]);

  /**
   * @param {Object} event The submit event object.
   */
  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    setSubmitting(true);
  }, []);

  return {
    handleChange,
    handleSubmit,
    values,
    valid,
    validationErrors,
  };
}
