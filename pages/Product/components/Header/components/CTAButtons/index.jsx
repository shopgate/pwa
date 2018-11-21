import React from 'react';
import PropTypes from 'prop-types';
import FavoritesButton from '@shopgate/pwa-ui-shared/FavoritesButton';
import AddToCartButton from '@shopgate/pwa-ui-shared/AddToCartButton';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/product/constants/Portals';
import styles from './style';
import connect from './connector';

/**
 * Renders CTA buttons for product page (add to cart + toggle favorites).
 *
 * @param {Object} props Props.
 * @returns {JSX}
 * @constructor
 */
const CTAButtons = props => (
  <div className={styles.buttons}>
    <Portal name={portals.PRODUCT_CTAS_FAVORITES_BEFORE} />
    <Portal name={portals.PRODUCT_CTAS_FAVORITES}>
      <FavoritesButton
        active={props.isFavorite}
        productId={props.productId}
        className={styles.favButton}
        rippleClassName={styles.ripple}
      />
    </Portal>
    <Portal name={portals.PRODUCT_CTAS_FAVORITES_AFTER} />
    <Portal name={portals.PRODUCT_CTAS_ADD_TO_CART_BEFORE} />
    <Portal name={portals.PRODUCT_CTAS_ADD_TO_CART}>
      <AddToCartButton
        isLoading={props.isLoading}
        isOrderable={props.isOrderable}
        isDisabled={props.isDisabled}
        handleAddToCart={props.handleAddToCart}
        buttonSize={styles.cartButtonSize}
        iconSize={styles.iconSize}
        className={styles.cartButton}
      />
    </Portal>
    <Portal name={portals.PRODUCT_CTAS_ADD_TO_CART_AFTER} />
  </div>
);

CTAButtons.propTypes = {
  isFavorite: PropTypes.bool.isRequired,
  handleAddToCart: PropTypes.func,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isOrderable: PropTypes.bool,
  productId: PropTypes.string,
};

CTAButtons.defaultProps = {
  handleAddToCart: () => {},
  isLoading: null,
  isOrderable: null,
  isDisabled: false,
  productId: null,
};

export default connect(CTAButtons);
