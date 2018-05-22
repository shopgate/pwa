import React from 'react';
import PropTypes from 'prop-types';
import FavoritesButton from '@shopgate/pwa-ui-shared/FavoritesButton';
import AddToCartButton from '@shopgate/pwa-ui-shared/AddToCartButton';
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
    <FavoritesButton
      active={props.isFavorite}
      productId={props.productId}
      className={styles.favButton}
      rippleClassName={styles.ripple}
    />
    <AddToCartButton
      isLoading={props.isLoading}
      isOrderable={props.isOrderable}
      isDisabled={props.isDisabled}
      handleAddToCart={props.handleAddToCart}
      buttonSize={styles.cartButtonSize}
      iconSize={styles.iconSize}
      className={styles.cartButton}
    />
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
