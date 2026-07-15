import React, {
  useCallback,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import connect from './connector';
import Layout from './components/Layout';

const ON_FOCUS_BLUR_DELAY_MS = 150;

/**
 * The CouponField component.
 * @param {Object} props Component props.
 * @returns {JSX.Element|null}
 */
const CouponField = ({
  addCoupon: addCouponAction,
  error,
  isLoading,
  isSupported,
  onFocus,
  setValue,
  value,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const isButtonVisible = isFocused || value;
  const isButtonDisabled = isLoading || !value.length;

  const setInputRef = useCallback((input) => {
    inputRef.current = input;
  }, []);

  const handleFocusChange = useCallback((nextFocused) => {
    if (!nextFocused && inputRef.current) {
      inputRef.current.blur();
    }

    setIsFocused(nextFocused);

    setTimeout(() => {
      onFocus(nextFocused);
    }, nextFocused ? 0 : ON_FOCUS_BLUR_DELAY_MS);
  }, [onFocus]);

  const addCoupon = useCallback((event) => {
    event.preventDefault();

    if (!isButtonVisible) {
      return;
    }

    if (isFocused) {
      handleFocusChange(false);
    }

    addCouponAction(value);
  }, [addCouponAction, handleFocusChange, isButtonVisible, isFocused, value]);

  const handleValueChange = useCallback((next) => {
    setValue(next);
  }, [setValue]);

  if (!isSupported) {
    return null;
  }

  const iconStyle = {
    opacity: isButtonVisible ? 1 : 0,
  };

  return (
    <div>
      <Layout
        handleAddCoupon={addCoupon}
        isLoading={isLoading}
        isButtonDisabled={isButtonDisabled}
        handleFocusChange={handleFocusChange}
        handleValueChange={handleValueChange}
        iconStyle={iconStyle}
        value={value}
        setInputRef={setInputRef}
        error={error}
      />
    </div>
  );
};

CouponField.propTypes = {
  addCoupon: PropTypes.func,
  error: PropTypes.string,
  isLoading: PropTypes.bool,
  isSupported: PropTypes.bool,
  onFocus: PropTypes.func,
  setValue: PropTypes.func,
  value: PropTypes.string,
};

CouponField.defaultProps = {
  addCoupon: () => { },
  setValue: () => { },
  isLoading: false,
  isSupported: true,
  onFocus: () => { },
  error: '',
  value: '',
};

export default connect(CouponField);

export { CouponField as UnwrappedCouponField };
