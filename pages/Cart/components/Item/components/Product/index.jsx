import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getAbsoluteHeight } from '@shopgate/pwa-common/helpers/dom';
import { CART_ITEM_TYPE_PRODUCT } from '@shopgate/pwa-common-commerce/cart/constants';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import CardListItem from '@shopgate/pwa-ui-shared/CardList/components/Item';
import MessageBar from '@shopgate/pwa-ui-shared/MessageBar';
import styles from '../../style';
import connect from './connector';
import Layout from './components/Layout';
import { CART_INPUT_AUTO_SCROLL_DELAY } from '../../../../constants';

const { variables } = themeConfig;

const messageStyles = {
  container: styles.messagesContainer,
  message: styles.messages,
};

/**
 * The CartProduct component.
 */
class CartProduct extends Component {
  static propTypes = {
    currency: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    product: PropTypes.shape().isRequired,
    quantity: PropTypes.number.isRequired,
    deleteProduct: PropTypes.func,
    isIos: PropTypes.bool,
    onToggleFocus: PropTypes.func,
    updateProduct: PropTypes.func,
  };

  static childContextTypes = {
    cartItemId: PropTypes.string,
    type: PropTypes.string,
    product: PropTypes.shape(),
  };

  static defaultProps = {
    isIos: false,
    deleteProduct: () => { },
    onToggleFocus: () => { },
    updateProduct: () => { },
  };

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
    };
  }

  /**
   * // TODO: change this!
   * Expose props to the descendant components to use them for the portals.
   * @return {Object}
   */
  getChildContext() {
    return {
      cartItemId: this.props.id,
      type: CART_ITEM_TYPE_PRODUCT,
      product: this.props.product,
    };
  }

  /**
   * Toggles the edit mode of the products. This should be always called,
   * when interaction with the quantity input happens.
   * @param {boolean} [isEnabled=true] Tells if the edit mode is enabled, or disabled.
   */
  toggleEditMode = (isEnabled = true) => {
    if (!this.props.isIos && isEnabled) {
      /**
       * When the user focuses the quantity input, the keyboard will pop up an overlap the input.
       * Therefore the input has to be scrolled into the viewport again. Since between the focus and
       * the keyboard appearance some time ticks away, the execution of the scroll code is delayed.
       *
       * This should not happen on iOS devices, since their webviews behave different.
       */
      setTimeout(() => {
        const yOffset = -(window.innerHeight / 2)
          + getAbsoluteHeight(this.cardElement)
          + variables.paymentBar.height;

        this.cardElement.scrollIntoView({
          behavior: 'smooth',
          yOffset,
        });
      }, CART_INPUT_AUTO_SCROLL_DELAY);
    }

    // Give the keyboard some time to slide out after blur, before further actions are taken.
    setTimeout(() => {
      this.props.onToggleFocus(isEnabled);
    }, isEnabled ? 300 : 0);

    this.setState({
      editMode: isEnabled,
    });
  };

  /**
   * Deletes the product from the cart.
   */
  deleteProduct = () => {
    this.props.deleteProduct(this.props.id);
  };

  /**
   * Updates the quantity of the product within the cart.
   * @param {number} quantity The new quantity
   */
  updateProduct = (quantity) => {
    this.props.updateProduct(this.props.id, quantity);
  };

  /**
   * @returns {jsx}
   */
  render() {
    const {
      currency,
      messages,
      product,
      quantity,
    } = this.props;
    const { editMode } = this.state;

    return (
      <CardListItem>
        <div ref={(element) => { this.cardElement = element; }} data-test-id="cartItem">
          {messages.length > 0 && (
            <MessageBar messages={messages} classNames={messageStyles} />
          )}
          <Layout
            handleDelete={this.deleteProduct}
            handleUpdate={this.updateProduct}
            toggleEditMode={this.toggleEditMode}
            editMode={editMode}
            product={product}
            currency={currency}
            quantity={quantity}
          />
        </div>
      </CardListItem>
    );
  }
}

export default connect(CartProduct);
