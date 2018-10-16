import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import UIEvents from '@shopgate/pwa-core/emitters/ui';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_ADD_TO_CART_BAR,
  PRODUCT_ADD_TO_CART_BAR_AFTER,
  PRODUCT_ADD_TO_CART_BAR_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import * as constants from './constants';
import AddToCartButton from './components/AddToCartButton';
import AddMoreButton from './components/AddMoreButton';
import CartItemsCount from './components/CartItemsCount';
import connect from './connector';
import styles from './style';

/**
 * The AddToCartBar component.
 */
class AddToCartBar extends Component {
  static propTypes = {
    conditioner: PropTypes.shape().isRequired,
    options: PropTypes.shape().isRequired,
    productId: PropTypes.string.isRequired,
    addToCart: PropTypes.func,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    addToCart: () => {},
    disabled: false,
    loading: false,
  };

  /**
   * Constructor.
   */
  constructor() {
    super();

    this.state = {
      clicked: false,
      visible: true,
      added: 0,
    };

    UIEvents.addListener(constants.SHOW_ADD_TO_CART_BAR, this.handleShow);
    UIEvents.addListener(constants.HIDE_ADD_TO_CART_BAR, this.handleHide);
    UIEvents.addListener(constants.INCREMENT_ACTION_COUNT, this.handleIncrement);
    UIEvents.addListener(constants.DECREMENT_ACTION_COUNT, this.handleDecrement);
    UIEvents.addListener(constants.RESET_ACTION_COUNT, this.handleReset);
  }

  /**
   * Unregisters the ui events.
   */
  componentWillUnmount() {
    UIEvents.removeListener(constants.SHOW_ADD_TO_CART_BAR, this.handleShow);
    UIEvents.removeListener(constants.HIDE_ADD_TO_CART_BAR, this.handleHide);
    UIEvents.removeListener(constants.INCREMENT_ACTION_COUNT, this.handleIncrement);
    UIEvents.removeListener(constants.DECREMENT_ACTION_COUNT, this.handleDecrement);
    UIEvents.removeListener(constants.RESET_ACTION_COUNT, this.handleReset);
  }

  handleShow = () => {
    this.setState({ visible: true });
  }

  handleHide = () => {
    this.setState({ visible: false });
  }

  handleIncrement = () => {
    this.setState(prevState => ({
      added: (prevState.added + 1),
    }));
  }

  handleDecrement = () => {
    this.setState(prevState => ({
      added: (prevState.added > 0 ? prevState.added - 1 : 0),
    }));
  }

  handleReset = () => {
    this.setState({ added: 0 });
  }

  /**
   * Handles the button click.
   * Checks if the button can be clicked and if
   * all criteria set by the conditioner are met.
   */
  handleAddToCart = () => {
    if (this.state.clicked) {
      return;
    }

    if (this.props.loading || this.props.disabled) {
      return;
    }

    this.props.conditioner.check().then((fullfilled) => {
      if (!fullfilled) {
        return;
      }

      this.setState({ clicked: true });

      this.props.addToCart({
        productId: this.props.productId,
        options: this.props.options,
        quantity: 1,
      });
    });
  }

  resetClicked = () => {
    this.setState({ clicked: false });
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    if (this.state.visible === false) {
      return null;
    }

    const { added } = this.state;

    return (
      <Fragment>
        <Portal name={PRODUCT_ADD_TO_CART_BAR_BEFORE} />
        <Portal name={PRODUCT_ADD_TO_CART_BAR}>
          <Fragment>
            <div className={styles.container} key="bar">
              <div className={styles.base}>
                <div className={styles.statusBar}>
                  <CartItemsCount itemCount={added} />
                  <AddMoreButton
                    handleAddToCart={this.handleAddToCart}
                    disabled={this.props.disabled}
                    loading={this.props.loading}
                    onReset={this.resetClicked}
                  />
                </div>
                <AddToCartButton
                  disabled={this.props.disabled}
                  itemCount={added}
                  handleAddToCart={this.handleAddToCart}
                />
              </div>
            </div>
            <div className={styles.dummy} key="dummy" />
          </Fragment>
        </Portal>
        <Portal name={PRODUCT_ADD_TO_CART_BAR_AFTER} />
      </Fragment>
    );
  }
}

export default connect(AddToCartBar);
