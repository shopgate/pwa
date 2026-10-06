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
  PRODUCT_CTAS_SHARE_BEFORE,
  PRODUCT_CTAS_SHARE,
  PRODUCT_CTAS_SHARE_AFTER,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { ProductShareButton } from '@shopgate/engage/product/components';
import { appConfig } from '@shopgate/engage';
import { useSelector } from 'react-redux';
import { makeStyles } from '@shopgate/engage/styles';
import { getProductTileActions } from '@shopgate/engage/settings/selectors/appSettings';
import connect from './connector';

const { pdpImageSliderPaginationType } = appConfig;

const BULLETS_BELOW_OFFSET = 28;

const useStyles = makeStyles()(theme => ({
  buttons: {
    position: 'absolute',
    right: theme.spacing(2),
    zIndex: 2,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    [theme.vars.components.iconButton.boxShadow]: theme.components.actionButton.boxShadow,
    gap: theme.spacing(1),
    '&[data-direction="vertical"]': {
      flexDirection: 'column',
    },
    '&[data-position="topRight"]': {
      top: theme.spacing(2),
    },
    '&[data-position="bottomRight"]': {
      bottom: theme.spacing(2),
    },
    '&[data-position="bottomRight"][data-bullets-below]': {
      bottom: `calc(${theme.spacing(2)}px + ${BULLETS_BELOW_OFFSET}px)`,
    },
  },
  favButton: {
    zIndex: 1,
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
  const { position, direction } = useSelector(getProductTileActions);
  const bulletsBelow = pdpImageSliderPaginationType === 'bulletsBelow' && hasImageGallery;

  return (
    <>
      <Portal name={PRODUCT_CTAS_BEFORE} />
      <Portal name={PRODUCT_CTAS}>
        <div
          className={cx(classes.buttons, 'theme__product__header__cta-buttons')}
          data-position={position}
          data-direction={direction}
          data-bullets-below={bulletsBelow ? true : undefined}
        >
          <Portal name={PRODUCT_CTAS_FAVORITES_BEFORE} />
          <Portal name={PRODUCT_CTAS_FAVORITES}>
            { isProductActive && (
              <FavoritesButton
                className={classes.favButton}
                size="medium"
                active={isFavorite}
                productId={productId}
              />
            )}
          </Portal>
          <Portal name={PRODUCT_CTAS_FAVORITES_AFTER} />
          <Portal name={PRODUCT_CTAS_SHARE_BEFORE} />
          <Portal name={PRODUCT_CTAS_SHARE}>
            {isProductActive && <ProductShareButton productId={productId} />}
          </Portal>
          <Portal name={PRODUCT_CTAS_SHARE_AFTER} />
        </div>
      </Portal>
      <Portal name={PRODUCT_CTAS_AFTER} />
    </>
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
