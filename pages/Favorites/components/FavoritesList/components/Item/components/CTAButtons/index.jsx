import React from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/favorites/constants/Portals';
import FavoritesButton from '@shopgate/pwa-ui-shared/FavoritesButton';
import AddToCartButton from '@shopgate/pwa-ui-shared/AddToCartButton';
import styles from './style';
import connect from './connector';

/**
 * Handles the add to cart action.
 * @param {Object} props The Component props
 */
const handleAddToCart = ({
  productId, addToCart, showVariantModal, isBaseProduct,
}) => {
  if (isBaseProduct) {
    showVariantModal(productId);
    return;
  }

  const productData = {
    productId,
    quantity: 1,
  };

  addToCart([productData]);
};

/**
 * Favorites item CTA buttons
 * @param {Object} props The component props.
 * @param {Object} context The component context.
 * @constructor
 */
const CTAButtons = (props, context) => (
  <div className={styles.ctaButtonWrapper}>
    <FavoritesButton
      productId={props.productId}
      active={props.active}
      removeThrottle={props.removeThrottle}
      onRippleComplete={props.onRippleComplete}
      once={props.favoritesOnce}
      readOnlyOnFetch
      noShadow
    />
    <Portal name={portals.FAVORITES_ADD_TO_CART_BEFORE} props={context} />
    <Portal name={portals.FAVORITES_ADD_TO_CART} props={context}>
      <AddToCartButton
        handleAddToCart={() => handleAddToCart(props)}
        isLoading={false}
        isDisabled={!props.isOrderable}
        isOrderable={!props.isBaseProduct && props.isOrderable}
        noShadow
      />
    </Portal>
    <Portal name={portals.FAVORITES_ADD_TO_CART_AFTER} props={context} />
  </div>
);

/* eslint-disable react/no-unused-prop-types */
CTAButtons.propTypes = {
  productId: PropTypes.string.isRequired,
  active: PropTypes.bool,
  addToCart: PropTypes.func,
  favoritesOnce: PropTypes.bool,
  isBaseProduct: PropTypes.bool,
  isOrderable: PropTypes.bool,
  onRippleComplete: PropTypes.func,
  removeThrottle: PropTypes.number,
  showVariantModal: PropTypes.func,
};

CTAButtons.defaultProps = {
  active: null,
  addToCart: () => {},
  favoritesOnce: false,
  isBaseProduct: true,
  isOrderable: true,
  onRippleComplete: () => {},
  removeThrottle: null,
  showVariantModal: () => {},
};
/* eslint-enable react/no-unused-prop-types */

export default connect(CTAButtons);
