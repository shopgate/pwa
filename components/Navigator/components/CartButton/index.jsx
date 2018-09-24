import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CartIcon from '@shopgate/pwa-ui-shared/icons/CartIcon';
import Ripple from '@shopgate/pwa-ui-shared/Ripple';
import variables from 'Styles/variables';
import CartButtonBadge from './components/CartButtonBadge';
import styles from './style';
import connect from './connector';

/**
 * The cart button component. It will show the amount of products in the cart as
 * a badge sitting on top of the cart icon.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
class CartButton extends Component {
  static propTypes = {
    activeCartRoute: PropTypes.bool.isRequired,
    cartProductCount: PropTypes.number.isRequired,
    openCart: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
  };

  /**
   * Component constructor.
   * @param {Object} props Component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      useAnimationDelay: true,
    };
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
   * Handles a click on the cart button and opens the cart tab.
   * @param {Object} event The event object.
   */
  handleClick = (event) => {
    event.preventDefault();
    this.props.openCart();
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const style = {};

    if (this.props.visible && this.props.cartProductCount > 0) {
      style.minWidth = variables.navigator.height;
      style.transform = 'translate3d(0, 0, 0)';
      style.transitionDelay = '600ms';

      if (!this.state.useAnimationDelay) {
        style.transitionDelay = 0;
        style.transitionDuration = '300ms';
      }
    }

    return (
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
    );
  }
}

export default connect(CartButton);
