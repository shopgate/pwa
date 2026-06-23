import React, {
  useCallback, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import Chevron from '../../icons/ChevronIcon';
import FormElement from '../../FormElement';

const useStyles = makeStyles()({
  select: {
    appearance: 'none',
    position: 'relative',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    padding: '0 20px 0 0',
    width: '100%',
    margin: '24px 0 0 0',
    outline: 0,
    fontSize: 16,
    lineHeight: '19px',
    zIndex: 10,
  },
  chevron: {
    position: 'absolute',
    top: '50%',
    right: 0,
    transform: 'translateY(-50%) rotateZ(-90deg)',
    fontSize: '1.3em !important',
    marginTop: -3,
  },
});

/**
 * Styled select for material-style forms (native select + chevron).
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const Select = ({
  name,
  options,
  translateErrorText,
  disabled,
  multiple,
  size,
  showErrorText,
  className,
  placeholder,
  label,
  errorText,
  required,
  isControlled,
  onChange,
  value: valueProp,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}) => {
  const { classes, cx } = useStyles();
  const [value, setValue] = useState(valueProp);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setValue(valueProp);
  }, [valueProp]);

  useEffect(() => {
    if (multiple || options?.[valueProp] !== undefined) {
      return;
    }
    const fallback = Object.entries(options)?.[0]?.[0];
    if (fallback === undefined) {
      return;
    }
    if (!isControlled) {
      setValue(fallback);
    }
    onChange(fallback);
    // Intentionally mount-only (same as legacy componentDidMount).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = useCallback(({ target }) => {
    let next = target.value;
    if (multiple) {
      next = Array.from(target.selectedOptions, option => option.value);
    }
    if (!isControlled) {
      setValue(next);
    }
    onChange(next);
  }, [isControlled, multiple, onChange]);

  const handleFocusChange = useCallback((focused) => {
    setIsFocused(focused);
  }, []);

  return (
    <FormElement
      className={cx(className, 'ui-shared__form__select')}
      placeholder={placeholder}
      htmlFor={name}
      label={label}
      errorText={errorText}
      translateErrorText={translateErrorText}
      isFocused={isFocused}
      hasValue={!!value || !!options['']}
      hasPlaceholder={!disabled || value !== ''}
      disabled={disabled}
      showErrorText={showErrorText}
    >
      <>
        <select
          id={name}
          name={name}
          onChange={handleChange}
          onFocus={() => handleFocusChange(true)}
          onBlur={() => handleFocusChange(false)}
          value={value}
          className={cx(classes.select, 'select')}
          disabled={disabled}
          required={required}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          {...multiple && {
            multiple,
            size,
          }}
        >
          {Object.keys(options).map(key => (
            <option className="option" value={key} key={`${name}_${key}`}>{options[key]}</option>
          ))}
        </select>
        <Chevron className={classes.chevron} />
      </>
    </FormElement>
  );
};

Select.propTypes = {
  name: PropTypes.string.isRequired,
  'aria-describedby': PropTypes.string,
  'aria-invalid': PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  errorText: PropTypes.node,
  isControlled: PropTypes.bool,
  label: PropTypes.node,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  options: PropTypes.shape(),
  placeholder: PropTypes.node,
  required: PropTypes.bool,
  showErrorText: PropTypes.bool,
  size: PropTypes.number,
  translateErrorText: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

Select.defaultProps = {
  'aria-invalid': false,
  'aria-describedby': null,
  className: '',
  errorText: '',
  isControlled: false,
  placeholder: '',
  label: '',
  onChange: () => {},
  options: {},
  translateErrorText: true,
  showErrorText: true,
  size: null,
  value: '',
  disabled: false,
  required: false,
  multiple: false,
};

export default Select;
