import React, {
  useState, useCallback, useMemo,
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
].map(suffix => `& ${bluredDateSelector}${suffix}`).join(', ');

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
    [webkitDateFields]: {
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

  const handleFocusChange = useCallback((focused) => {
    setIsFocused(focused);
    onFocusChange(focused);
  }, [onFocusChange]);

  const handleChange = useCallback((v, event) => {
    onChange(v, event);
  }, [onChange]);

  const handleValidate = useCallback((v) => {
    const ve = onValidate(v);

    if (ve !== true && ve) {
      setValidationError(ve);
    } else {
      setValidationError(prev => (prev ? null : prev));
    }

    return ve === true;
  }, [onValidate]);

  const isLabelFloating = useMemo(() => {
    if (typeof navigator !== 'undefined' && navigator.userAgent.includes('Firefox') && type === 'date') {
      return true;
    }
    return isFocused || !!value;
  }, [isFocused, value, type]);

  const isHintVisible = isFocused && !value;
  const hasErrorMessage = !!(validationError || errorText);

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
          validationError={validationError}
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
