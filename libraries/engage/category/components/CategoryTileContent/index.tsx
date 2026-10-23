import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@shopgate/engage/styles';
import { Ellipsis } from '@shopgate/engage/components';
import { useProductImageShadow } from '@shopgate/engage/product/hooks';
import { getProductTileNameMaxLines } from '@shopgate/engage/settings/selectors/appSettings';
import type { CategoryImageRatio } from '../../hooks/useCategoryImageRatio';
import CategoryImage from '../CategoryImage';

const useStyles = makeStyles({ name: 'CategoryTileContent' })(theme => ({
  imageWrapper: {
    display: 'block',
    padding: theme.components.tiles.imagePadding,
  },
  imageFrame: {
    display: 'block',
    '&[data-inner-shadow]': {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: theme.components.productImage.borderRadius,
      ':after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        boxShadow: 'inset 0 0 20px rgba(0, 0, 0, .05)',
        pointerEvents: 'none',
      },
    },
  },
  image: {
    borderRadius: theme.components.productImage.borderRadius,
  },
  name: {
    display: 'block',
    padding: theme.components.tiles.textPadding,
    paddingTop: theme.components.tiles.textPaddingTop,
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: 1.2,
    wordBreak: 'break-word',
    hyphens: 'auto',
  },
}));

export interface CategoryTileContentProps {
  name: string;
  imageUrl?: string | null;
  image: CategoryImageRatio;
  /** Stable classes of the image and the name, for the styling of the surrounding tile. */
  classNames?: { image?: string; name?: string };
  children?: ReactNode;
}

/**
 * The image and the name of a category tile. The caller wraps them in a link or a button.
 * @returns The content of the tile.
 */
const CategoryTileContent = ({
  name,
  imageUrl,
  image,
  classNames = {},
  children,
}: CategoryTileContentProps) => {
  const { classes, cx } = useStyles();
  const showInnerShadow = useProductImageShadow();
  const nameMaxLines = useSelector(getProductTileNameMaxLines);

  return (
    <>
      <span className={cx(classes.imageWrapper, classNames.image)} aria-hidden>
        <span className={classes.imageFrame} data-inner-shadow={showInnerShadow ? true : undefined}>
          <CategoryImage
            className={classes.image}
            src={imageUrl}
            ratio={image.ratio}
            resolutions={image.resolutions}
          />
        </span>
      </span>
      <span className={cx(classes.name, classNames.name)}>
        <Ellipsis rows={nameMaxLines}>{name}</Ellipsis>
        {children}
      </span>
    </>
  );
};

export default CategoryTileContent;
