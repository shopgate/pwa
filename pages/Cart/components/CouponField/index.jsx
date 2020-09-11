import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { getAbsoluteHeight } from '@shopgate/pwa-common/helpers/dom';
import { CART_INPUT_AUTO_SCROLL_DELAY } from '@shopgate/engage/cart';
import { hasWebBridge } from '@shopgate/engage/core';
import connect from './connector';
import Layout from './components/Layout';
import { container } from './style';

/**
 * The CouponField component.
 */
class CouponField extends PureComponent {
  static propTypes = {
    addCoupon: PropTypes.func,
    error: PropTypes.string,
    isIos: PropTypes.bool,
    isLoading: PropTypes.bool,
    isSupported: PropTypes.bool,
    onFocus: PropTypes.func,
    setValue: PropTypes.func,
    value: PropTypes.string,
  };

  static defaultProps = {
    addCoupon: () => { },
    setValue: () => { },
    isIos: false,
    isLoading: false,
    isSupported: true,
    onFocus: () => { },
    error: '',
    value: '',
  };

  state = {
    isFocused: false,
  }

  /**
   * Checks if the icon button should be visible.
   * @returns {boolean}
   */
  get isButtonVisible() {
    return (this.state.isFocused || this.props.value);
  }

  /**
   * Checks if the icon button should be disabled.
   * @returns {boolean}
   */
  get isButtonDisabled() {
    return (this.props.isLoading || !this.props.value.length);
  }

  /**
   * Sets a reference to the coupon input element.
   * @param {HTMLElement} input The element.
   */
  setInputRef = (input) => {
    this.inputElement = input;
  }

  /**
   * Adds a coupon to the cart.
   * @param {Object} event The click event object.
   */
  addCoupon = (event) => {
    event.preventDefault();

    if (!this.isButtonVisible) {
      return;
    }

    if (this.state.isFocused) {
      this.handleFocusChange(false);
    }

    this.props.addCoupon(this.props.value);
  };

  /**
   * Handle change inside the input field
   * @param {Object} value The value inside the field
   */
  handleValueChange = (value) => {
    this.props.setValue(value);
  };

  /**
   * Internal focus event handler.
   * @param {boolean} isFocused Whether the input component is focused.
   */
  handleFocusChange = (isFocused) => {
    if (!hasWebBridge() && !this.props.isIos && isFocused) {
      /**
       * When the user focuses the coupon input, the keyboard will pop up an overlap the input.
       * Therefore the input has to be scrolled into the viewport again. Since between the focus and
       * the keyboard appearance some time ticks away, the execution of the scroll code is delayed.
       *
       * This should not happen on iOS devices, since their webviews behave different.
       */
      setTimeout(() => {
        const yOffset = -(window.innerHeight / 2) + getAbsoluteHeight(this.element);

        this.element.scrollIntoView({
          behavior: 'smooth',
          yOffset,
        });
      }, CART_INPUT_AUTO_SCROLL_DELAY);
    }

    if (!isFocused) {
      this.inputElement.blur();
    }

    this.setState({ isFocused });

    // Give the keyboard some time to slide out after blur, before further actions are taken.
    setTimeout(() => {
      this.props.onFocus(isFocused);
    }, isFocused ? 0 : 150);
  };

  /**
   * @returns {JSX}
   */
  render() {
    if (!this.props.isSupported) {
      return null;
    }

    const iconStyle = {
      opacity: (this.isButtonVisible) ? 1 : 0,
    };

    return (
      <div ref={(element) => { this.element = element; }} className={container}>
        <Layout
          handleAddCoupon={this.addCoupon}
          isLoading={this.props.isLoading}
          isButtonDisabled={this.isButtonDisabled}
          handleFocusChange={this.handleFocusChange}
          handleValueChange={this.handleValueChange}
          iconStyle={iconStyle}
          value={this.props.value}
          setInputRef={this.setInputRef}
          error={this.props.error}
        />
      </div>
    );
  }
}

export default connect(CouponField);

export { CouponField as UnwrappedCouponField };
