import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import connect from './connector';
import styles from './style';

/**
 * The AddToCartButton component.
 */
class AddToCartButton extends Component {
  static propTypes = {
    handleAddToCart: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    itemCount: PropTypes.number.isRequired,
    openCart: PropTypes.func.isRequired,
  }

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      opened: !!props.itemCount,
    };
  }

  /**
   * Resets to not open when the count is 0.
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      opened: !!nextProps.itemCount,
    });
  }

  /**
   * Adds a new product to cart or opens the cart if it already has products in it.
   */
  handleClick = () => {
    const { itemCount, handleAddToCart, openCart } = this.props;

    if (!itemCount) {
      handleAddToCart();
      return;
    }

    this.setState({
      opened: true,
    });

    openCart();
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const { itemCount } = this.props;
    const style = this.state.opened ? { width: '40%' } : null;
    const className = this.props.isDisabled ? styles.disabled : styles.button;

    return (
      <button className={className} style={style} onClick={this.handleClick} data-test-id="addToCartButton">
        {!itemCount ? (
          <I18n.Text string="product.add_to_cart" />
        ) : (
          <I18n.Text string="product.go_to_cart" />
        )}
      </button>
    );
  }
}

export default connect(AddToCartButton);
