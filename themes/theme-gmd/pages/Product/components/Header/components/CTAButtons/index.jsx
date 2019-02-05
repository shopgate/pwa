import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import FavoritesButton from '@shopgate/pwa-ui-shared/FavoritesButton';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_CTAS,
  PRODUCT_CTAS_AFTER,
  PRODUCT_CTAS_BEFORE,
  PRODUCT_CTAS_FAVORITES,
  PRODUCT_CTAS_FAVORITES_BEFORE,
  PRODUCT_CTAS_FAVORITES_AFTER,
  PRODUCT_CTAS_ADD_TO_CART,
  PRODUCT_CTAS_ADD_TO_CART_BEFORE,
  PRODUCT_CTAS_ADD_TO_CART_AFTER,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import CartButton from './components/CartButton';
import styles from './style';
import connect from './connector';

/**
 * Renders CTA buttons for product page (add to cart + toggle favorites).
 * @param {Object} props Props.
 * @returns {JSX}
 */
const CTAButtons = ({ isFavorite, productId }) => (
  <Fragment>
    <Portal name={PRODUCT_CTAS_BEFORE} />
    <Portal name={PRODUCT_CTAS}>
      <div className={styles.buttons} >
        <Portal name={PRODUCT_CTAS_FAVORITES_BEFORE} />
        <Portal name={PRODUCT_CTAS_FAVORITES}>
          <FavoritesButton
            className={styles.favButton}
            rippleClassName={styles.ripple}
            active={isFavorite}
            productId={productId}
          />
        </Portal>
        <Portal name={PRODUCT_CTAS_FAVORITES_AFTER} />
        <Portal name={PRODUCT_CTAS_ADD_TO_CART_BEFORE} />
        <Portal name={PRODUCT_CTAS_ADD_TO_CART}>
          <CartButton />
        </Portal>
        <Portal name={PRODUCT_CTAS_ADD_TO_CART_AFTER} />
      </div>
    </Portal>
    <Portal name={PRODUCT_CTAS_AFTER} />
  </Fragment>
);

CTAButtons.propTypes = {
  isFavorite: PropTypes.bool.isRequired,
  productId: PropTypes.string,
};

CTAButtons.defaultProps = {
  productId: null,
};

export default connect(pure(CTAButtons));
