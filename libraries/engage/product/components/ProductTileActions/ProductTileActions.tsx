import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@shopgate/engage/styles';
import { getProductTileActions } from '@shopgate/engage/settings/selectors/appSettings';
import ItemFavoritesButton from '../ProductGrid/components/Item/components/ItemFavoritesButton';
import { ProductCardAddToCart } from '../ProductCardAddToCart';

export interface ProductTileActionsProps {
  productId: string;
  className?: string;
}

const useStyles = makeStyles({ name: 'ProductTileActions' })(theme => ({
  root: {
    position: 'absolute',
    right: 8,
    zIndex: 1,
    display: 'flex',
    gap: 6,
    [theme.vars.components.iconButton.boxShadow]: theme.components.actionButton.boxShadow,
    '&[data-position="topRight"]': {
      top: 8,
    },
    '&[data-position="bottomRight"]': {
      bottom: 8,
    },
  },
}));

/**
 * Favorites and add to cart buttons on the image of a product tile, as configured in the
 * app settings.
 * @param props The component props.
 * @returns The buttons.
 */
const ProductTileActions = ({ productId, className }: ProductTileActionsProps) => {
  const { classes, cx } = useStyles();
  const { position, addToCart } = useSelector(getProductTileActions);

  return (
    <div
      className={cx(classes.root, 'engage__product-tile-actions', className)}
      data-position={position}
    >
      {addToCart === 'actionButton' && <ProductCardAddToCart productId={productId} />}
      <ItemFavoritesButton productId={productId} />
    </div>
  );
};

export default ProductTileActions;
