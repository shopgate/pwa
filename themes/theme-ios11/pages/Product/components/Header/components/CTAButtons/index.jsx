import React, { memo } from 'react';
import PropTypes from 'prop-types';
import FavoritesButton from '@shopgate/pwa-ui-shared/FavoritesButton';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_CTAS,
  PRODUCT_CTAS_AFTER,
  PRODUCT_CTAS_BEFORE,
  PRODUCT_CTAS_FAVORITES,
  PRODUCT_CTAS_FAVORITES_BEFORE,
  PRODUCT_CTAS_FAVORITES_AFTER,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { appConfig } from '@shopgate/engage';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const { pdpImageSliderPaginationType } = appConfig;

const iconSize = 24;

const useStyles = makeStyles()(theme => ({
  buttons: {
    position: 'absolute',
    right: theme.spacing(2),
    top: -20,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  favButton: {
    zIndex: 1,
    fontSize: iconSize,
  },
  wrapper: {
    position: 'relative',
    top: -40,
    right: -16,
  },
  ripple: {
    padding: 8,
  },
}));

/**
 * Renders CTA buttons for product page (add to cart + toggle favorites).
 * @param {Object} props Props.
 * @returns {JSX}
 */
const CTAButtons = ({
  isFavorite, productId, isProductActive, hasImageGallery,
}) => {
  const { classes, cx } = useStyles();

  return (
    <div className={pdpImageSliderPaginationType === 'bulletsBelow' && hasImageGallery ? classes.wrapper : null}>
      <Portal name={PRODUCT_CTAS_BEFORE} />
      <Portal name={PRODUCT_CTAS}>
        <div className={cx(classes.buttons, 'theme__product__header__cta-buttons')}>
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
        </div>
      </Portal>
      <Portal name={PRODUCT_CTAS_AFTER} />
    </div>
  );
};

CTAButtons.propTypes = {
  isFavorite: PropTypes.bool.isRequired,
  hasImageGallery: PropTypes.bool,
  isProductActive: PropTypes.bool,
  productId: PropTypes.string,
};

CTAButtons.defaultProps = {
  isProductActive: true,
  productId: null,
  hasImageGallery: false,
};

export default connect(memo(CTAButtons));
