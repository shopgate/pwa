import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { SurroundPortals, FavoritesButton } from '@shopgate/engage/components';
import { PRODUCT_ITEM_FAVORITES_BUTTON } from '@shopgate/engage/category';
import { isRelativeProductOnList } from '@shopgate/engage/favorites';
import { getLoadWishlistOnAppStartEnabled } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    position: 'absolute',
    top: 0,
    right: 16,
    left: 'auto',
    transform: 'translate3d(0, -50%, 0)',
  },
});

/**
 * The item favorites button component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const ItemFavoritesButton = ({
  productId,
}) => {
  const { classes } = useStyles();
  const loadWishlistOnAppStartEnabled = useSelector(getLoadWishlistOnAppStartEnabled);
  const isOnWishlist = useSelector(state => isRelativeProductOnList(state, { productId }));
  const isFavorite = useMemo(
    () => (!loadWishlistOnAppStartEnabled ? false : isOnWishlist),
    [isOnWishlist, loadWishlistOnAppStartEnabled]
  );

  const portalProps = useMemo(() => ({ productId }), [productId]);

  return (
    <SurroundPortals portalName={PRODUCT_ITEM_FAVORITES_BUTTON} portalProps={portalProps}>
      <div className={classes.root} data-test-id="favorites">
        <FavoritesButton
          active={isFavorite}
          productId={productId}
          noShadow
          removeWithRelatives
        />
      </div>
    </SurroundPortals>
  );
};

ItemFavoritesButton.propTypes = {
  productId: PropTypes.string.isRequired,
};

export default memo(ItemFavoritesButton);
