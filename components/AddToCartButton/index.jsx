/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CartPlusIcon from 'Components/icons/CartPlusIcon';
import TickIcon from 'Components/icons/TickIcon';
import IndicatorCircle from 'Components/IndicatorCircle';
import colors from 'Styles/colors';
import styles from './style';

/**
 * AddToCartButton component.
 */
class AddToCartButton extends Component {
  static propTypes = {
    handleAddToCart: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isOrderable: PropTypes.bool.isRequired,
    buttonSize: PropTypes.number,
    className: PropTypes.string,
    iconSize: PropTypes.number,
  };

  static defaultProps = {
    buttonSize: styles.buttonSize,
    className: null,
    iconSize: styles.iconSize,
  };

  /**
   * Constructor for the AddToCartButton component.
   * @param {Object} props Props for the component.
   */
  constructor(props) {
    super(props);

    this.state = {
      showCheckmark: null,
    };
  }

  /**
   * Handles the button click.
   * - Show checkmark.
   * - Add to cart.
   * - Wait 900ms.
   * - Show cart icon again.
   */
  handleClick = () => {
    // Ignore clicks when checkmark or loading spinner is shown.
    if (this.state.showCheckmark || this.props.isLoading) {
      return;
    }

    this.props.handleAddToCart();

    if (!this.props.isOrderable) {
      return;
    }

    this.setState({
      showCheckmark: true,
    });

    setTimeout(() => {
      this.setState({
        showCheckmark: false,
      });
    }, 900);
  };

  /**
   * Handles the cart animation end event.
   * Resets the showCheckmark state to null in order to
   * prevent the icon from animating after changing visibility
   * of the view.
   * This is caused by CSS animations that get re-applied when
   * setting an element from hidden (display: none) to visible.
   */
  handleCartAnimationEnd = () => {
    if (this.state.showCheckmark === false) {
      this.setState({
        showCheckmark: null,
      });
    }
  };

  /**
   * Renders the component
   * @returns {JSX}
   */
  render() {
    // Set initial base styles
    let buttonStyle = styles.buttonReady;
    let tickIconStyle = styles.icon;
    let cartPlusIconStyle = styles.icon;

    // Depending on the isLoading prop we only show the spinner or the other way around.
    const iconOpacity = this.props.isLoading ? { opacity: 0 } : { opacity: 1 };
    const spinnerInlineStyle = this.props.isLoading ? { opacity: 1 } : { opacity: 0 };

    /**
     * The initial positions for the icons:
     * Tick icon stays hidden on top, Cart icon stays visibly at the center
     */
    let tickInlineStyle = this.state.showCheckmark === null ? {
      transform: 'translate3d(0, 300%, 0)',
      ...iconOpacity,
    } : null;

    let cartInlineStyle = this.state.showCheckmark === null ? {
      transform: 'translate3d(0, -50%, 0)',
      ...iconOpacity,
    } : null;

    if (this.state.showCheckmark) {
      /**
       * When checkmark should be shown, we start the spring transition
       * Tick icon springs in, and cart icon springs out.
       */
      tickIconStyle += ` ${styles.springFromBottom}`;
      cartPlusIconStyle += ` ${styles.springToTop}`;
      buttonStyle = styles.buttonSuccess;
      /**
       * After the keyframe animation is done the transform values are reset
       * We add the inline style to make sure the icons stay where they are even after the animation
       */
      tickInlineStyle = {
        transform: 'translate3d(0, -50%, 0)',
        ...iconOpacity,
      };
      cartInlineStyle = {
        transform: 'translate3d(0, -300%, 0)',
        ...iconOpacity,
      };
    } else if (this.state.showCheckmark !== null) {
      /**
       * When checkmark should no longer be shown we start the spring out transition.
       * Tick icon springs out, cart icon spring in.
       * We don't want a animation when we initially go to the page therefore this only happens
       * after the user pressed the button.
       */
      tickIconStyle += ` ${styles.springToBottom}`;
      cartPlusIconStyle += ` ${styles.springFromTop}`;
      /**
       * After the keyframe animation is done the transform values are reset
       * We add the inline style to make sure the icons stay where they are even after the animation
       */
      cartInlineStyle = {
        transform: 'translate3d(0, -50%, 0)',
        ...iconOpacity,
      };
      tickInlineStyle = {
        transform: 'translate3d(0, -300%, 0)',
        ...iconOpacity,
      };
    }

    return (
      <button
        className={`${this.props.className} ${styles.buttonWrapper(this.props.buttonSize, this.props.iconSize)} ${buttonStyle}`}
        onClick={this.handleClick}
      >
        <div className={`${styles.icon} ${styles.spinnerIcon}`} style={spinnerInlineStyle}>
          <IndicatorCircle color={colors.primaryContrast} strokeWidth={5} />
        </div>
        <div className={tickIconStyle} style={tickInlineStyle}>
          <TickIcon />
        </div>
        <div
          className={cartPlusIconStyle}
          style={cartInlineStyle}
          onAnimationEnd={this.handleCartAnimationEnd}
        >
          <CartPlusIcon />
        </div>
      </button>
    );
  }
}

export default AddToCartButton;
