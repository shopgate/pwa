import React from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/product/constants/Portals';
import FavoritesButton from '@shopgate/pwa-ui-shared/FavoritesButton';
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
        noShadow
      />
    </Portal>
    <Portal name={portals.PRODUCT_CTAS_FAVORITES_AFTER} />
  </div>
);

CTAButtons.propTypes = {
  isFavorite: PropTypes.bool.isRequired,
  productId: PropTypes.string,
};

CTAButtons.defaultProps = {
  productId: null,
};

export default connect(CTAButtons);
