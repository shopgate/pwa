// @flow
import * as React from 'react';
import PT from 'prop-types';
import { getAbsoluteHeight } from '@shopgate/pwa-common/helpers/dom';
import { CART_ITEM_TYPE_PRODUCT, CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import CardListItem from '@shopgate/pwa-ui-shared/CardList/components/Item';
import { MessageBar } from '@shopgate/engage/components';
import { getPageSettings } from '@shopgate/engage/core/config';
import {
  messagesContainerCard,
  messagesCard,
  messagesContainerLine,
  messagesLine,
} from './CartItem.style';
import connect from './CartItemProduct.connector';
import { CartItemProductLayout } from './CartItemProductLayout';
import { CART_INPUT_AUTO_SCROLL_DELAY } from '../../cart.constants';
import { noGap } from './CartItemProduct.style';
import { type OwnProps, type StateProps, type DispatchProps } from './CartItemProduct.types';

type Props = OwnProps & StateProps & DispatchProps;

type State = {
  editMode: boolean,
}

const { variables } = themeConfig;

const messageStyles = {
  card: {
    container: messagesContainerCard,
    message: messagesCard,
  },
  line: {
    container: messagesContainerLine,
    message: messagesLine,
  },
};

/**
 * The CartProduct component.
 */
class CartItemProduct extends React.Component<Props, State> {
  static childContextTypes = {
    cartItem: PT.shape(),
    cartItemId: PT.string,
    type: PT.string,
    product: PT.shape(),
    registerAction: PT.func,
    invokeAction: PT.func,
  };

  static defaultProps = {
    isIos: false,
    fulfillment: null,
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
    this.actions = {};
  }

  /**
   * // TODO: change this!
   * Expose props to the descendant components to use them for the portals.
   * @return {Object}
   */
  getChildContext() {
    return {
      cartItem: {
        id: this.props.id,
        product: this.props.product,
        quantity: this.props.quantity,
        fulfillment: this.props.fulfillment,
      },
      cartItemId: this.props.id,
      type: CART_ITEM_TYPE_PRODUCT,
      product: this.props.product,
      registerAction: this.registerAction,
      invokeAction: this.invokeAction,
    };
  }

  actions: { [string]: Function }

  cardElement: HTMLElement | null;

  /**
   * @param {boolean} action The action to register.
   * @param {Function} cb action callback
   */
  registerAction = (action, cb) => {
    this.actions[action] = cb;
  }

  /**
   * @param {boolean} action The action to call.
   * @param {Function} args action args
   */
  invokeAction = (action, ...args) => {
    if (!this.actions[action]) {
      return;
    }
    this.actions[action](...args);
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

        if (this.cardElement) {
          this.cardElement.scrollIntoView({
            behavior: 'smooth',
            yOffset,
          });
        }
      }, CART_INPUT_AUTO_SCROLL_DELAY);
    }

    // Give the keyboard some time to slide out after blur, before further actions are taken.
    setTimeout(() => {
      if (this.props.onToggleFocus) {
        this.props.onToggleFocus(isEnabled);
      }
    }, isEnabled ? 300 : 0);

    this.setState({
      editMode: isEnabled,
    });
  };

  /**
   * Deletes the product from the cart.
   */
  deleteProduct = () => {
    if (this.props.deleteProduct) {
      this.props.deleteProduct(this.props.id);
    }
  };

  /**
   * Updates the quantity of the product within the cart.
   * @param {number} quantity The new quantity
   */
  updateProduct = (quantity: number) => {
    if (this.props.updateProduct) {
      this.props.updateProduct(this.props.id, quantity);
    }
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
    const { cartItemsDisplay = 'line' } = getPageSettings(CART_PATH);

    return (
      <CardListItem className={cartItemsDisplay === 'card' ? noGap : null}>
        <div ref={(element) => { this.cardElement = element; }} data-test-id="cartItem">
          {messages.length > 0 && (
            <MessageBar messages={messages} classNames={messageStyles[cartItemsDisplay]} />
          )}
          <CartItemProductLayout
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

export default connect(CartItemProduct);
