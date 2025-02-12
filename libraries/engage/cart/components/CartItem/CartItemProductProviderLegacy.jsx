import React from 'react';
import PropTypes from 'prop-types';
import { CART_ITEM_TYPE_PRODUCT } from '@shopgate/engage/cart';
import { useCartItemProduct } from './CartItem.hooks';

/**
 * Provides legacy context for CartItemProduct component and its children.
 * Within PWA7 the context was refactored to the new context API. To keep compatibility with
 * older extensions, this provider is used to provide the legacy context.
 *
 * Should be removed when PWA 7 is deployed to all of the shops and affected extensions can be
 * updated without the need to support older PWA versions.
 */
class LegacyProvider extends React.Component {
  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      cartItemId: props.cartItemId,
      product: props.product,
    };
  }

  /**
   * @param {Object} nextProps Next props
   * @param {*} prevState  Prev state
   * @returns {Object|null}
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.cartItemId !== prevState.cartItemId ||
      nextProps.product !== prevState.product
    ) {
      return {
        cartItemId: nextProps.cartItemId,
        product: nextProps.product,
      };
    }
    return null;
  }

  /**
   * @returns {Object}
   */
  getChildContext() {
    return {
      type: CART_ITEM_TYPE_PRODUCT,
      cartItemId: this.state.cartItemId,
      product: this.state.product,
    };
  }

  /**
   * @returns {JSX.Element}
   */
  render() {
    return this.props.children;
  }
}

LegacyProvider.propTypes = {
  cartItemId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  product: PropTypes.shape().isRequired,
};

LegacyProvider.childContextTypes = {
  type: PropTypes.string,
  cartItemId: PropTypes.string,
  product: PropTypes.shape(),
};

/**
 * Bridges the CartItemProductContext value to the legacy CartItemProduct context.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const CartItemProductProviderLegacy = ({ children }) => {
  const { cartItemId, product } = useCartItemProduct();

  return (
    <LegacyProvider cartItemId={cartItemId} product={product}>
      {children}
    </LegacyProvider>
  );
};

CartItemProductProviderLegacy.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartItemProductProviderLegacy;
