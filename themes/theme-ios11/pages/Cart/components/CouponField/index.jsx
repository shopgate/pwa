import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { RouteContext } from '@shopgate/pwa-common/context';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { getAbsoluteHeight } from '@shopgate/pwa-common/helpers/dom';
import connect from './connector';
import Layout from './components/Layout';
import { CART_INPUT_AUTO_SCROLL_DELAY } from '../../constants';

const defaultState = {
  value: '',
};

/**
 * The CouponField component.
 */
class CouponField extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    addCoupon: PropTypes.func,
    isIos: PropTypes.bool,
    isLoading: PropTypes.bool,
    isSupported: PropTypes.bool,
    onFocus: PropTypes.func,
  };

  static defaultProps = {
    addCoupon: () => { },
    isIos: false,
    isLoading: false,
    isSupported: true,
    onFocus: () => { },
  };

  state = defaultState;

  /**
   * Checks if the icon button should be visible.
   * @returns {boolean}
   */
  get isButtonVisible() {
    return (this.state.isFocused || this.state.value);
  }

  /**
   * Checks if the icon button should be disabled.
   * @returns {boolean}
   */
  get isButtonDisabled() {
    return (this.props.isLoading || !this.state.value.length);
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

    this.props.addCoupon(this.state.value)
      .then(this.reset)
      .catch(() => { });
  };

  /**
   * Handle change inside the input field
   * @param {Object} value The value inside the field
   */
  handleValueChange = (value) => {
    this.setState({
      value,
    });
  };

  /**
   * Internal focus event handler.
   * @param {boolean} isFocused Whether the input component is focused.
   */
  handleFocusChange = (isFocused) => {
    if (!this.props.isIos && isFocused) {
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

  reset = () => {
    this.setState(defaultState);
  }

  /**
   * @param {Object} nextProps The next component props.
   */
  USAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line camelcase
    /**
     * Reset the form values when the page is not visible to the user.
     */
    if (this.props.visible && !nextProps.visible) {
      this.setState(defaultState);
    }
  }

  /**
   * @returns {JSX}
   */
  render() {
    if (!this.props.isSupported) {
      return null;
    }

    const labelStyle = { display: this.state.value ? 'none' : 'block' };
    const iconStyle = {
      opacity: (this.isButtonVisible) ? 1 : 0,
    };

    return (
      <div ref={(element) => { this.element = element; }}>
        <Layout
          handleAddCoupon={this.addCoupon}
          isFocused={this.state.isFocused}
          isLoading={this.props.isLoading}
          isButtonDisabled={this.isButtonDisabled}
          handleFocusChange={this.handleFocusChange}
          handleValueChange={this.handleValueChange}
          labelStyle={labelStyle}
          iconStyle={iconStyle}
          value={this.state.value}
          setInputRef={this.setInputRef}
        />
      </div>
    );
  }
}

export default connect(props => (
  <RouteContext.Consumer>
    {({ visible }) => (
      <LoadingContext.Consumer>
        {({ isLoading }) => (
          <CouponField {...props} isLoading={isLoading(CART_PATH)} visible={visible} />
        )}
      </LoadingContext.Consumer>
    )}
  </RouteContext.Consumer>
));

export { CouponField as UnwrappedCouponField };
