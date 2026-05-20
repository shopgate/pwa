import React, {
  useState, useCallback, useMemo, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import Label from './components/Label';
import Underline from './components/Underline';
import ErrorText from './components/ErrorText';
import Hint from './components/Hint';
import FormElement from './components/FormElement/index';

const bluredDateSelector = 'input[type="date"]:in-range:not(:focus)';
const webkitDateFields = [
  '::-webkit-datetime-edit-year-field',
  '::-webkit-datetime-edit-month-field',
  '::-webkit-datetime-edit-day-field',
  '::-webkit-datetime-edit-text',
].map(suffix => `${bluredDateSelector}${suffix}`).join(', ');

const useStyles = makeStyles()(theme => ({
  input: {
    position: 'relative',
    paddingBottom: theme.spacing(2),
    width: '100%',
    '& input[type="date"]': {
      minHeight: '1.3rem',
      appearance: 'none',
      paddingLeft: 0,
      marginLeft: 0,
    },
    [`& ${webkitDateFields}`]: {
      padding: 0,
      color: 'transparent',
    },
  },
  multiLine: {
    position: 'relative',
    width: '100%',
  },
}));

/**
 * A component that provides a styled text field for user input in material design.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const TextField = ({
  name,
  className,
  disabled,
  errorText,
  hintText,
  inputComponent,
  isControlled,
  label,
  multiLine,
  onChange,
  onFocusChange,
  onSanitize,
  onValidate,
  password,
  required,
  setRef,
  showErrorText,
  translateErrorText,
  type,
  value,
}) => {
  const { classes, cx } = useStyles();
  const [isFocused, setIsFocused] = useState(false);
  const [validationError, setValidationError] = useState(null);
  /**
   * Mirrors validation errors set during initial validate (Input constructor) without setState,
   * so Underline / ErrorText (rendered after FormElement) still see the message in the same pass.
   */
  const syncValidationErrorRef = useRef(null);

  /**
   * Internal focus event handler.
   * @param {boolean} focused Whether the input component is focused.
   */
  const handleFocusChange = useCallback((focused) => {
    setIsFocused(focused);
    onFocusChange(focused);
  }, [onFocusChange]);

  /**
   * Updates the state if the input value has been changed.
   * @param {string} v The entered text.
   * @param {Object} event The original event object.
   */
  const handleChange = useCallback((v, event) => {
    onChange(v, event);
  }, [onChange]);

  /**
   * Updates the validation error text if required.
   * @param {string} enteredValue The entered text.
   * @param {boolean} isInitial Whether this is the initial value of the input field.
   * @returns {boolean} Whether the validation was successful.
   */
  const handleValidate = useCallback((enteredValue, isInitial) => {
    const validationErr = onValidate(enteredValue);

    if (validationErr !== true && validationErr) {
      syncValidationErrorRef.current = validationErr;
      /**
       * An error message was returned by the validation callback. Update the state.
       * Because the validation is performed when the component is constructed, we need to make
       * sure we're not calling setState() in this situation.
       */
      if (!isInitial) {
        setValidationError(validationErr);
      }
    } else {
      // There was no error, clear the state variable.
      setValidationError((prev) => {
        const hadSyncError = syncValidationErrorRef.current !== null;
        if (prev !== null || hadSyncError) {
          syncValidationErrorRef.current = null;
          return null;
        }
        return prev;
      });
    }

    // Forward the boolean result to the input field.
    return validationErr === true;
  }, [onValidate]);

  const isLabelFloating = useMemo(() => {
    // On Firefox empty date inputs always show a placeholder with date pattern
    if (typeof navigator !== 'undefined' && navigator.userAgent.includes('Firefox') && type === 'date') {
      return true;
    }
    return isFocused || !!value;
  }, [isFocused, value, type]);

  const isHintVisible = isFocused && !value;
  const displayValidationError = validationError || syncValidationErrorRef.current;
  const hasErrorMessage = !!(displayValidationError || errorText);

  const containerClass = multiLine ? classes.multiLine : classes.input;

  return (
    <div className={cx(containerClass, className, 'textField', 'ui-shared__text-field', {
      disabled,
    })}
    >
      <Hint visible={isHintVisible} hintText={hintText} />
      <Label
        name={name}
        label={label}
        isFocused={isFocused}
        isFloating={isLabelFloating}
        hasErrorMessage={hasErrorMessage}
      />
      <FormElement
        id={name}
        multiLine={multiLine}
        name={name}
        setRef={setRef}
        onFocusChange={handleFocusChange}
        onChange={handleChange}
        onSanitize={onSanitize}
        onValidate={handleValidate}
        password={password}
        type={type}
        value={value}
        isControlled={isControlled}
        inputComponent={inputComponent}
        disabled={disabled}
        required={required}
        attributes={{
          'aria-invalid': !!errorText,
          'aria-describedby': hasErrorMessage ? `ariaError-${name}` : null,
        }}
      />

      <Underline isFocused={isFocused} hasErrorMessage={hasErrorMessage} />
      {showErrorText && (
        <ErrorText
          validationError={displayValidationError}
          errorText={errorText}
          translate={translateErrorText}
          elementName={name}
        />
      )}
    </div>
  );
};

TextField.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ]),
  disabled: PropTypes.bool,
  errorText: PropTypes.node,
  hintText: PropTypes.node,
  /* eslint-disable-next-line react/forbid-prop-types */
  inputComponent: PropTypes.any,
  isControlled: PropTypes.bool,
  label: PropTypes.node,
  multiLine: PropTypes.bool,
  onChange: PropTypes.func,
  onFocusChange: PropTypes.func,
  onSanitize: PropTypes.func,
  onValidate: PropTypes.func,
  password: PropTypes.bool,
  required: PropTypes.bool,
  setRef: PropTypes.func,
  showErrorText: PropTypes.bool,
  translateErrorText: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.string,
};

TextField.defaultProps = {
  className: '',
  errorText: '',
  showErrorText: true,
  setRef: () => { },
  hintText: '',
  isControlled: false,
  label: '',
  multiLine: false,
  onChange: () => { },
  onFocusChange: () => { },
  onSanitize: value => value,
  onValidate: () => true,
  required: false,
  password: false,
  translateErrorText: true,
  type: 'text',
  value: '',
  inputComponent: 'input',
  disabled: false,
};

export default TextField;
