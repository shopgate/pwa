import React, {
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
  useEffect,
  forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import { isIOs } from '@shopgate/pwa-core';
import { parseFloatString, formatFloat } from './helper';

/**
 * A Quantity Input with unit support.
 * @returns {JSX}
 */
const QuantityInput = forwardRef(({
  className,
  onChange,
  onFocus: customOnFocus,
  onBlur: customOnBlur,
  value,
  maxDecimals,
  unit,
  minValue,
  maxValue,
  ...inputProps
}, outerInputRef) => {
  const inputRef = outerInputRef || useRef();
  const [inputValue, setInputValue] = useState(formatFloat(value, maxDecimals));
  const [isFocused, setIsFocused] = useState(false);

  const onFocus = useCallback((event) => {
    customOnFocus(event);
    setIsFocused(true);
  }, [customOnFocus]);

  const onBlur = useCallback((event) => {
    const newValue = parseFloatString(inputValue, maxDecimals);
    setIsFocused(false);

    // If invalid switch to old value.
    if (Number.isNaN(parseFloat(inputValue))) {
      setInputValue(formatFloat(value, maxDecimals));
      return;
    }

    if (newValue !== value) {
      onChange(newValue);
    }

    customOnBlur(event, newValue);
  }, [customOnBlur, inputValue, maxDecimals, onChange, value]);

  const handleChange = useCallback((event) => {
    let newValue = event.target.value;

    if (newValue !== '') {
      if (minValue && newValue < minValue) {
        newValue = `${minValue}`;
      }

      if (maxValue && newValue > maxValue) {
        newValue = `${maxValue}`;
      }
    }

    setInputValue(newValue);
  }, [maxValue, minValue]);

  // Select the current input value after focus.
  useLayoutEffect(() => {
    if (isFocused && isIOs) {
      inputRef.current.select();
    }
  }, [inputRef, isFocused]);

  // Sync actual float value with displayed content.
  useEffect(() => {
    setInputValue(formatFloat(value, maxDecimals));
  }, [maxDecimals, value]);

  // Stop the context menu from opening.
  useLayoutEffect(() => {
    inputRef.current.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      event.stopPropagation();
      return false;
    });
  }, [inputRef]);

  const displayedValue = !isFocused && unit ? `${inputValue} ${unit}` : inputValue;

  return (
    <input
      ref={inputRef}
      {...inputProps}
      inputMode="decimal"
      /* Pattern signals some browsers to use specialized keyboard (if inputmode not supported */
      pattern="[0-9.,]*"
      onFocus={onFocus}
      onBlur={onBlur}
      className={className}
      value={displayedValue}
      onChange={handleChange}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }}
    />
  );
});

QuantityInput.propTypes = {
  value: PropTypes.number.isRequired,
  className: PropTypes.string,
  maxDecimals: PropTypes.number,
  maxValue: PropTypes.number,
  minValue: PropTypes.number,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  unit: PropTypes.string,
};

QuantityInput.defaultProps = {
  className: '',
  maxDecimals: 2,
  unit: null,
  minValue: null,
  maxValue: null,
  onFocus: () => {},
  onChange: () => {},
  onBlur: () => {},
};

export default QuantityInput;

