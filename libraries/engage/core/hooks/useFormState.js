import {
  useRef, useState, useEffect, useCallback,
} from 'react';
import { debounce } from 'lodash';
import { useScrollTo } from './useScrollTo';
import { i18n } from '../helpers/i18n';
import { useValidation } from '../validation';

/**
 * Converts validation errors into errors for form builder.
 * @param {Object} validationErrors The validation errors.
 * @returns {Array}
 */
export const convertValidationErrors = validationErrors => Object
  .keys(validationErrors)
  .map(key => ({
    path: key,
    message: i18n.text(validationErrors[key]),
  }));

/**
 * @param {Object} initialState The initial form state.
 * @param {Function} complete The completion callback.
 * @param {Object} validationConstraints validationConstraints
 * @param {Object} [formContainerRef=null] A ref to a container with forms
 * @returns {{ handleChange, handleSubmit, values, valid, validationErrors: ?Object, isSubmitting }}
 */
export function useFormState(
  initialState,
  complete,
  validationConstraints = {},
  formContainerRef = null
) {
  const { scrollTo } = useScrollTo(formContainerRef);

  // Submit lock prevents the form from being submitted multiple times
  const submitLock = useRef(false);

  const [values, setValues] = useState(initialState);
  const [isSubmitting, setSubmitting] = useState(false);
  const [changed, setChanged] = useState(false);
  const [ignoreErrors, setIgnoreErrors] = useState(false);
  const {
    valid, validationErrors, validate, reset,
  } = useValidation(validationConstraints);

  const scrollToError = useCallback(() => {
    scrollTo('.validationError');
  }, [scrollTo]);

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
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!isSubmitting) {
      return;
    }
    let mounted = true;
    if ((valid === true || ignoreErrors) && !submitLock.current) {
      submitLock.current = true;
      (async () => {
        await complete(values);
        if (mounted) {
          setSubmitting(false);
          setChanged(false);
          submitLock.current = false;
        }
      })();
    }
    // eslint-disable-next-line consistent-return
    return () => {
      mounted = false;
    };
  }, [isSubmitting, valid, ignoreErrors]);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    scrollToError();
  }, [isSubmitting, scrollToError]);

  useEffect(() => () => {
    submitLock.current = false;
  }, []);

  // -- VALIDATION ON SUBMIT ---------
  useEffect(() => {
    if (ignoreErrors) {
      return;
    }

    // Yest no validation on submit
    if (changed && valid !== null) {
      validate(values);
    }
    if (isSubmitting && valid === null) {
      validate(values);
    }
    if (isSubmitting && valid === false) {
      setSubmitting(false);
    }
  }, [changed, validate, values, isSubmitting, valid, ignoreErrors]);

  const handleSetIgnoreErrors = useCallback((value) => {
    setIgnoreErrors(value);

    if (ignoreErrors === true) {
      reset();
    }
  }, [ignoreErrors, reset]);

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
   * Debounced (dbl-click) submit handler
   * @param {Object} event The submit event object.
   */
  const handleSubmit = debounce((event) => {
    if (event?.preventDefault) {
      event.preventDefault();
    }
    setSubmitting(true);
  }, 300, {
    leading: true,
    trailing: false,
  });

  return {
    resetValidationErrors: reset,
    handleChange,
    handleSubmit,
    values,
    valid: !ignoreErrors ? valid : true,
    validationErrors: !ignoreErrors ? validationErrors : [],
    isSubmitting,
    setValues,
    scrollToError,
    setIgnoreErrors: handleSetIgnoreErrors,
    validate,
  };
}
