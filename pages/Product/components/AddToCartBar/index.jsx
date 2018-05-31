import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    isVisible: PropTypes.bool.isRequired,
    cartProductCount: PropTypes.number,
    handleAddToCart: PropTypes.func,
    isDisabled: PropTypes.bool,
    isLoading: PropTypes.bool,
    isOrderable: PropTypes.bool,
  };

  static defaultProps = {
    cartProductCount: null,
    handleAddToCart: () => {},
    isDisabled: false,
    isLoading: false,
    isOrderable: true,
  };

  /**
   * Constructor.
   */
  constructor() {
    super();

    this.state = {
      itemCount: 0,
    };
  }

  /**
   * Resets the item count if the cart is emptied.
   * @param {Object} nextProps The next props.
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      itemCount: nextProps.cartProductCount,
    });
  }

  /**
   * Prevents from unnecessary component updates.
   * @param {Object} nextProps The next component props.
   * @param {Object} nextState The next component state.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (
      (this.props.isVisible !== nextProps.isVisible) ||
      (this.state.itemCount !== nextState.itemCount) ||
      (nextProps.isDisabled !== this.props.isDisabled)
    );
  }

  handleAddToCart = () => {
    if (this.props.isLoading || this.props.isDisabled) {
      return;
    }

    this.props.handleAddToCart();

    if (!this.props.isOrderable) {
      return;
    }

    this.setState({
      itemCount: this.state.itemCount + 1,
    });
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    if (this.props.isVisible === false) {
      return null;
    }
    const { itemCount } = this.state;

    return [
      <div className={styles.container} key="bar">
        <div className={styles.base}>
          <div className={styles.statusBar}>
            <CartItemsCount itemCount={itemCount} />
            <AddMoreButton handleAddToCart={this.handleAddToCart} />
          </div>
          <AddToCartButton
            isDisabled={this.props.isDisabled}
            itemCount={itemCount}
            handleAddToCart={this.handleAddToCart}
          />
        </div>
      </div>,
      <div className={styles.dummy} key="dummy" />,
    ];
  }
}

export default connect(AddToCartBar);
