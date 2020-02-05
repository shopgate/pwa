import { useState, useEffect } from 'react';

/**
 * @param {Object} initialState The initial form state.
 * @param {Function} complete The completion callback.
 * @returns {Object}
 */
export function useFormState(initialState, complete) {
  const [values, setValues] = useState(initialState);
  const [isSubmitting, setSubmitting] = useState(false);
  const [changed, setChanged] = useState(false);

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

    complete(values);
    setChanged(false);
    setSubmitting(false);
  }, [complete, isSubmitting, values]);

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
    setSubmitting(true);
  }

  return {
    handleChange,
    handleSubmit,
    values,
  };
}
