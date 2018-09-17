import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { UIEvents } from '@shopgate/pwa-core';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  NAV_BAR_NAVIGATOR_ICONS_CART_BUTTON,
  NAV_BAR_NAVIGATOR_ICONS_CART_BUTTON_BEFORE,
  NAV_BAR_NAVIGATOR_ICONS_CART_BUTTON_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import CartIcon from '@shopgate/pwa-ui-shared/icons/CartIcon';
import Ripple from '@shopgate/pwa-ui-shared/Ripple';
import variables from 'Styles/variables';
import CartButtonBadge from './components/CartButtonBadge';
import styles from './style';
import connect from './connector';
import { TOGGLE_NAVIGATOR_CART } from '../../constants';

/**
 * The CartButton component. It will show the amount of products in the cart as
 * a badge sitting on top of the cart icon.
 * @returns {JSX}
 */
class CartButton extends Component {
  static propTypes = {
    activeCartRoute: PropTypes.bool.isRequired,
    cartProductCount: PropTypes.number.isRequired,
    openCart: PropTypes.func,
  };

  static defaultProps = {
    openCart: () => {},
  };

  /**
   * @param {Object} props Component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      useAnimationDelay: true,
      visible: true,
    };

    UIEvents.on(TOGGLE_NAVIGATOR_CART, this.toggle);
  }

  /**
   * If route changed remember old route.
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    const isFirstProduct = this.props.cartProductCount === 0 && nextProps.cartProductCount > 0;

    this.setState({
      useAnimationDelay: isFirstProduct || nextProps.activeCartRoute,
    });
  }

  /**
   * @param {boolean} visible The next visibility state.
   */
  toggle = (visible) => {
    this.setState({ visible });
  }

  /**
   * Handles a click on the cart button and opens the cart tab.
   * @param {Object} event The event object.
   */
  handleClick = (event) => {
    event.preventDefault();
    this.props.openCart();
  };

  /**
   * @returns {JSX}
   */
  render() {
    const style = {};

    if (this.state.visible && this.props.cartProductCount > 0) {
      style.minWidth = variables.navigator.height;
      style.transform = 'translate3d(0, 0, 0)';
      style.transitionDelay = '600ms';

      if (!this.state.useAnimationDelay) {
        style.transitionDelay = 0;
        style.transitionDuration = '300ms';
      }
    }

    return (
      <Fragment>
        <Portal name={NAV_BAR_NAVIGATOR_ICONS_CART_BUTTON_BEFORE} />
        <Portal name={NAV_BAR_NAVIGATOR_ICONS_CART_BUTTON} props={{ CartButton }}>
          <button
            data-test-id="CartButton"
            className={styles.button}
            style={style}
            onClick={this.handleClick}
          >
            <Ripple fill className={styles.buttonContent} size={navigator.height}>
              <CartIcon />
              <CartButtonBadge productCount={this.props.cartProductCount} />
            </Ripple>
          </button>
        </Portal>
        <Portal name={NAV_BAR_NAVIGATOR_ICONS_CART_BUTTON_AFTER} />
      </Fragment>
    );
  }
}

export default connect(CartButton);

export { CartButton as UnwrappedCartButton };
