import React, {
  useCallback,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { getAbsoluteHeight } from '@shopgate/pwa-common/helpers/dom';
import { CART_INPUT_AUTO_SCROLL_DELAY } from '@shopgate/engage/cart';
import { hasWebBridge } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';
import Layout from './components/Layout';

const useStyles = makeStyles()({
  container: {
    background: 'var(--color-background-accent)',
  },
});

const ON_FOCUS_BLUR_DELAY_MS = 150;

/**
 * The CouponField component.
 * @param {Object} props Component props.
 * @returns {JSX.Element|null}
 */
const CouponField = ({
  addCoupon: addCouponAction,
  error,
  isIos,
  isLoading,
  isSupported,
  onFocus,
  setValue,
  value,
}) => {
  const { classes } = useStyles();
  const [isFocused, setIsFocused] = useState(false);
  const elementRef = useRef(null);
  const inputRef = useRef(null);

  const isButtonVisible = isFocused || value;
  const isButtonDisabled = isLoading || !value.length;

  const setInputRef = useCallback((input) => {
    inputRef.current = input;
  }, []);

  const handleFocusChange = useCallback((nextFocused) => {
    if (!hasWebBridge() && !isIos && nextFocused) {
      /**
       * When the user focuses the coupon input, the keyboard will pop up an overlap the input.
       * Therefore the input has to be scrolled into the viewport again. Since between the focus and
       * the keyboard appearance some time ticks away, the execution of the scroll code is delayed.
       *
       * This should not happen on iOS devices, since their webviews behave different.
       */
      setTimeout(() => {
        const el = elementRef.current;
        if (!el) {
          return;
        }
        const yOffset = -(window.innerHeight / 2) + getAbsoluteHeight(el);
        el.scrollIntoView({
          behavior: 'smooth',
          yOffset,
        });
      }, CART_INPUT_AUTO_SCROLL_DELAY);
    }

    if (!nextFocused && inputRef.current) {
      inputRef.current.blur();
    }

    setIsFocused(nextFocused);

    setTimeout(() => {
      onFocus(nextFocused);
    }, nextFocused ? 0 : ON_FOCUS_BLUR_DELAY_MS);
  }, [isIos, onFocus]);

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
    <div
      ref={elementRef}
      className={classes.container}
    >
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
  isIos: PropTypes.bool,
  isLoading: PropTypes.bool,
  isSupported: PropTypes.bool,
  onFocus: PropTypes.func,
  setValue: PropTypes.func,
  value: PropTypes.string,
};

CouponField.defaultProps = {
  addCoupon: () => { },
  setValue: () => { },
  isIos: false,
  isLoading: false,
  isSupported: true,
  onFocus: () => { },
  error: '',
  value: '',
};

export default connect(CouponField);

export { CouponField as UnwrappedCouponField };
