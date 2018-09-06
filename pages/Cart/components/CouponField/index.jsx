import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RouteContext } from '@virtuous/react-conductor/Router';
import { getAbsoluteHeight } from '@shopgate/pwa-common/helpers/dom';
import connect from './connector';
import Layout from './components/Layout';
import { CART_INPUT_AUTO_SCROLL_DELAY } from '../../constants';

const defaultState = {
  value: '',
};

/**
 * The Coupon Field component.
 */
class CouponField extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    addCoupon: PropTypes.func,
    isIos: PropTypes.bool,
    isLoading: PropTypes.bool,
    isSupported: PropTypes.bool,
    onToggleFocus: PropTypes.func,
  };

  static defaultProps = {
    addCoupon: () => {},
    isIos: false,
    isLoading: false,
    isSupported: true,
    onToggleFocus: () => {},
  };

  state = defaultState;

  /**
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    /**
     * Reset the form values when the page is not visible to the user.
     */
    if (this.props.visible && !nextProps.visible) {
      this.setState(defaultState);
    }
  }

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
      .catch(() => {});
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
       * the keyboard apearance some time ticks away, the execution of the scroll code is delayed.
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

    this.setState({
      isFocused,
    });

    this.props.onToggleFocus(isFocused);
  };

  reset = () => {
    this.setState(defaultState);
  }

  /**
   * Renders the component.
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
        />
      </div>
    );
  }
}

export default connect(props => (
  <RouteContext.Consumer>
    {({ visible }) => (
      <CouponField {...props} visible={visible} />
    )}
  </RouteContext.Consumer>
));
