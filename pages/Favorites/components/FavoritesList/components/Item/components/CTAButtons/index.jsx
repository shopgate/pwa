import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/favorites/constants/Portals';
import FavoritesButton from '@shopgate/pwa-ui-shared/FavoritesButton';
import AddToCartButton from '@shopgate/pwa-ui-shared/AddToCartButton';
import styles from './style';
import connect from './connector';

/**
 * Favorites item CTA buttons.
 */
class CTAButtons extends Component {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    active: PropTypes.bool,
    addToCart: PropTypes.func,
    favoritesOnce: PropTypes.bool,
    hasVariants: PropTypes.bool,
    isBaseProduct: PropTypes.bool,
    isOrderable: PropTypes.bool,
    onRippleComplete: PropTypes.func,
    removeThrottle: PropTypes.number,
    showVariantModal: PropTypes.func,
  };

  static defaultProps = {
    active: null,
    addToCart: () => {},
    favoritesOnce: false,
    isBaseProduct: true,
    isOrderable: true,
    hasVariants: false,
    onRippleComplete: () => {},
    removeThrottle: null,
    showVariantModal: () => {},
  };

  /**
   * @return {Object}
   */
  get portalProps() {
    return {
      className: styles.cartButton,
      handleAddToCart: this.handleAddToCart,
      isLoading: false,
      isBaseProduct: this.props.isBaseProduct,
      isDisabled: !this.props.isOrderable && !this.props.hasVariants,
      noShadow: false,
      productId: this.props.productId,
    };
  }

  /**
   * Handles the add to cart action.
   * @param {Object} props The Component props
   */
  handleAddToCart = () => {
    if (this.props.isBaseProduct && this.props.hasVariants) {
      this.props.showVariantModal(this.props.productId);
      return;
    }

    const productData = {
      productId: this.props.productId,
      quantity: 1,
    };

    this.props.addToCart(productData);
  };

  /**
   * @return {JSX}
   */
  render() {
    return (
      <div className={styles.ctaButtonWrapper}>
        <FavoritesButton
          productId={this.props.productId}
          active={this.props.active}
          removeThrottle={this.props.removeThrottle}
          onRippleComplete={this.props.onRippleComplete}
          once={this.props.favoritesOnce}
          readOnlyOnFetch
        />
        <Portal name={portals.FAVORITES_ADD_TO_CART_BEFORE} />
        <Portal
          name={portals.FAVORITES_ADD_TO_CART}
          props={this.portalProps}
        >
          <AddToCartButton
            className={styles.cartButton}
            onClick={this.handleAddToCart}
            isLoading={false}
            isDisabled={!this.props.isOrderable && !this.props.hasVariants}
          />
        </Portal>
        <Portal name={portals.FAVORITES_ADD_TO_CART_AFTER} />
      </div>
    );
  }
}

export default connect(CTAButtons);
