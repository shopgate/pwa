import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_ITEM_FAVORITES_BUTTON,
  PRODUCT_ITEM_FAVORITES_BUTTON_AFTER,
  PRODUCT_ITEM_FAVORITES_BUTTON_BEFORE,
} from '@shopgate/pwa-common-commerce/category/constants/Portals';
import FavoritesButton from '@shopgate/pwa-ui-shared/FavoritesButton';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()({
  root: {
    position: 'absolute',
    top: 0,
    right: 16,
    left: 'auto',
    transform: 'translate3d(0, -50%, 0)',
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      display: 'none',
    },
  },
});

/**
 * The item favorites button component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ItemFavoritesButton = ({ productId, isFavorite }) => {
  const { classes } = useStyles();
  const portalProps = { productId };

  return (
    <>
      <Portal name={PRODUCT_ITEM_FAVORITES_BUTTON_BEFORE} props={portalProps} />
      <Portal name={PRODUCT_ITEM_FAVORITES_BUTTON} props={portalProps}>
        <div className={classes.root} data-test-id="favorites">
          <FavoritesButton
            active={isFavorite}
            productId={productId}
            noShadow
            removeWithRelatives
          />
        </div>
      </Portal>
      <Portal name={PRODUCT_ITEM_FAVORITES_BUTTON_AFTER} props={portalProps} />
    </>
  );
};

ItemFavoritesButton.propTypes = {
  productId: PropTypes.string.isRequired,
  isFavorite: PropTypes.bool,
};

ItemFavoritesButton.defaultProps = {
  isFavorite: false,
};

export default connect(memo(ItemFavoritesButton));
