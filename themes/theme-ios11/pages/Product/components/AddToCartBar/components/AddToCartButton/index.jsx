import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import connect from './connector';
import styles from './style';

/**
 * The AddToCartButton component.
 */
class AddToCartButton extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    handleAddToCart: PropTypes.func.isRequired,
    itemCount: PropTypes.number.isRequired,
    openCart: PropTypes.func.isRequired,
    onReset: PropTypes.func,
  }

  static defaultProps = {
    onReset: () => { },
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
    const {
      itemCount, handleAddToCart, openCart, onReset,
    } = this.props;

    if (!itemCount) {
      handleAddToCart();
      setTimeout(() => {
        // Take care that the reset happens after the addToCart request was dispatched.
        onReset();
      }, 0);
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
    const className = this.props.disabled ? styles.disabled : styles.button;

    return (
      <button
        className={className}
        style={style}
        onClick={this.handleClick}
        data-test-id="addToCartBarButton"
      >
        <I18n.Text string={!itemCount ? 'product.add_to_cart' : 'product.go_to_cart'} />
      </button>
    );
  }
}

export default connect(AddToCartButton);
