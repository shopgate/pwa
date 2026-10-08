import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FavoritesButton, SurroundPortals } from '@shopgate/engage/components';
import {
  PRODUCT_CTAS,
  PRODUCT_CTAS_FAVORITES,
  PRODUCT_CTAS_SHARE,
} from '@shopgate/engage/product/constants';
import { ProductShareButton } from '@shopgate/engage/product/components/ProductShareButton';
import { useStickyValue } from '@shopgate/engage/product/hooks';
import { appConfig } from '@shopgate/engage';
import { useSelector } from 'react-redux';
import { makeStyles } from '@shopgate/engage/styles';
import { getProductActionButtons } from '@shopgate/engage/settings/selectors/appSettings';
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
      bottom: theme.spacing(2) + BULLETS_BELOW_OFFSET,
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
  const { position, direction } = useSelector(getProductActionButtons);
  const hasGallery = useStickyValue(hasImageGallery, hasImageGallery === null);
  const bulletsBelow = pdpImageSliderPaginationType === 'bulletsBelow' && !!hasGallery;

  const favoritesFirst = position === 'topRight' && direction === 'vertical';
  const favorites = (
    <SurroundPortals portalName={PRODUCT_CTAS_FAVORITES}>
      {isProductActive && (
        <FavoritesButton
          className={classes.favButton}
          size="medium"
          active={isFavorite}
          productId={productId}
        />
      )}
    </SurroundPortals>
  );

  return (
    <SurroundPortals portalName={PRODUCT_CTAS}>
      <div
        className={cx(classes.buttons, 'theme__product__header__cta-buttons')}
        data-position={position}
        data-direction={direction}
        data-bullets-below={bulletsBelow ? true : undefined}
      >
        {favoritesFirst && favorites}
        <SurroundPortals portalName={PRODUCT_CTAS_SHARE}>
          {isProductActive && <ProductShareButton productId={productId} />}
        </SurroundPortals>
        {!favoritesFirst && favorites}
      </div>
    </SurroundPortals>
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
  hasImageGallery: null,
};

export default connect(memo(CTAButtons));
