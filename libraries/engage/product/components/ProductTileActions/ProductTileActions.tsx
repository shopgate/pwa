import { useSelector } from 'react-redux';
import { makeStyles } from '@shopgate/engage/styles';
import { getProductActionButtons } from '@shopgate/engage/settings/selectors/appSettings';
import ItemFavoritesButton from '../ItemFavoritesButton';
import { ProductCardAddToCart } from '../ProductCardAddToCart';

export interface ProductTileActionsProps {
  productId: string;
  className?: string;
  /** Hides the favorites button regardless of the app settings. */
  hideFavorites?: boolean;
  /** Hides the add to cart button regardless of the app settings. */
  hideAddToCart?: boolean;
}

const useStyles = makeStyles({ name: 'ProductTileActions' })(theme => ({
  root: {
    position: 'absolute',
    right: theme.spacing(1),
    margin: 'var(--product-tile-actions-inset, 0)',
    zIndex: 1,
    display: 'flex',
    gap: theme.spacing(0.75),
    [theme.vars.components.iconButton.boxShadow]: theme.components.actionButton.boxShadow,
    '&[data-direction="vertical"]': {
      flexDirection: 'column',
    },
    '&[data-position="topRight"]': {
      top: theme.spacing(1),
    },
    '&[data-position="bottomRight"]': {
      bottom: theme.spacing(1),
    },
  },
}));

/**
 * Favorites and add to cart buttons on the image of a product tile, as configured in the
 * app settings.
 * @returns The buttons.
 */
const ProductTileActions = ({
  productId,
  className,
  hideFavorites = false,
  hideAddToCart = false,
}: ProductTileActionsProps) => {
  const { classes, cx } = useStyles();
  const { position, addToCart, direction } = useSelector(getProductActionButtons);
  const favoritesFirst = position === 'topRight' && direction === 'vertical';
  const showFavorites = !hideFavorites;
  const showAddToCart = !hideAddToCart && addToCart === 'actionButton';

  if (!showFavorites && !showAddToCart) {
    return null;
  }

  return (
    <div
      className={cx(classes.root, 'engage__product-tile-actions', className)}
      data-position={position}
      data-direction={direction}
    >
      {showFavorites && favoritesFirst && <ItemFavoritesButton productId={productId} />}
      {showAddToCart && <ProductCardAddToCart productId={productId} />}
      {showFavorites && !favoritesFirst && <ItemFavoritesButton productId={productId} />}
    </div>
  );
};

export default ProductTileActions;
