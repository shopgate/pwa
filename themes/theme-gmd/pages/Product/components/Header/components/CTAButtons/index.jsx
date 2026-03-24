import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import CartButton from './components/CartButton';
import connect from './connector';

const { variables } = themeConfig;
const iconSize = 24;

const useStyles = makeStyles()({
  buttons: {
    position: 'absolute',
    right: variables.gap.big,
    top: -30,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  favButton: {
    marginRight: variables.gap.big,
    zIndex: 1,
    fontSize: iconSize,
  },
  ripple: {
    padding: 8,
  },
});

/**
 * Renders CTA buttons for product page (add to cart + toggle favorites).
 * @param {Object} props Props.
 * @returns {JSX}
 */
const CTAButtons = ({ isFavorite, productId, isProductActive }) => {
  const { classes } = useStyles();

  return (
    <>
      <Portal name={PRODUCT_CTAS_BEFORE} />
      <Portal name={PRODUCT_CTAS}>
        <div className={classNames(classes.buttons, 'theme__product__header__cta-buttons')}>
          <Portal name={PRODUCT_CTAS_FAVORITES_BEFORE} />
          <Portal name={PRODUCT_CTAS_FAVORITES}>
            { isProductActive && (
            <FavoritesButton
              className={classes.favButton}
              rippleClassName={classes.ripple}
              active={isFavorite}
              productId={productId}
            />
            )}
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
    </>
  );
};

CTAButtons.propTypes = {
  isFavorite: PropTypes.bool.isRequired,
  isProductActive: PropTypes.bool,
  productId: PropTypes.string,
};

CTAButtons.defaultProps = {
  productId: null,
  isProductActive: true,
};

export default connect(memo(CTAButtons));
