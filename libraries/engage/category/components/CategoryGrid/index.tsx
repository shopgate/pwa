import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@shopgate/engage/styles';
import { Ellipsis, Portal } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import {
  CATEGORY_GRID_ITEM,
  CATEGORY_GRID_SHOW_ALL_PRODUCTS,
} from '@shopgate/engage/category/constants';
import { useCategoryGridColumns } from '@shopgate/engage/category/hooks';
import { useProductImageShadow } from '@shopgate/engage/product/hooks';
import {
  getCategoryImageRatio,
  getProductTileNameMaxLines,
} from '@shopgate/engage/settings/selectors/appSettings';
import CategoryImage from '../CategoryImage';
import CategoryLink from '../CategoryLink';
import type { CategoryNavigationItem } from '../../types';

const IMAGE_WIDTH = 440;
const MAX_PLACEHOLDERS = 8;

interface CategoryGridStyleParams {
  columns: number;
  aspectRatio: string;
}

const useStyles = makeStyles<CategoryGridStyleParams>({ name: 'CategoryGrid' })((theme, {
  columns,
  aspectRatio,
}) => ({
  root: {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap: theme.spacing(2),
    margin: 0,
    padding: theme.spacing(2),
    listStyle: 'none',
  },
  item: {
    minWidth: 0,
  },
  showAllProductsItem: {
    gridColumn: '1 / -1',
  },
  showAllProducts: {
    display: 'block',
    padding: theme.spacing(1, 0),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightBold,
    textDecoration: 'none',
    outline: 0,
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.text.primary}`,
      outlineOffset: 2,
    },
  },
  tile: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.components.tiles.padding,
    background: theme.components.tiles.backgroundColor,
    border: theme.components.tiles.border,
    borderRadius: theme.components.tiles.borderRadius,
    color: theme.palette.text.primary,
    textDecoration: 'none',
    outline: 0,
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.text.primary}`,
      outlineOffset: 2,
    },
  },
  imageWrapper: {
    padding: theme.components.tiles.imagePadding,
  },
  imageFrame: {
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
  fallback: {
    width: '100%',
    height: '100%',
    background: theme.palette.background.emphasized,
  },
  placeholderImage: {
    aspectRatio,
    borderRadius: theme.components.productImage.borderRadius,
    background: theme.palette.background.emphasized,
  },
  name: {
    padding: theme.components.tiles.textPadding,
    paddingTop: theme.components.tiles.textPaddingTop,
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: 1.2,
    wordBreak: 'break-word',
    hyphens: 'auto',
  },
  placeholderName: {
    height: 14,
    width: '70%',
    marginTop: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.background.emphasized,
  },
}));

export interface CategoryGridProps {
  categories?: CategoryNavigationItem[] | null;
  /** Number of placeholder tiles while the categories load. */
  prerender?: number;
  /** The category whose subcategories are shown. */
  parentCategory?: CategoryNavigationItem | null;
  /** Whether the grid starts with an entry that shows all products of the parent category. */
  showAllProducts?: boolean;
}

/**
 * Renders categories as a grid of image tiles.
 * @returns The grid.
 */
const CategoryGrid = ({
  categories,
  prerender = 0,
  parentCategory = null,
  showAllProducts = false,
}: CategoryGridProps) => {
  const columns = useCategoryGridColumns();
  const { width, height } = useSelector(getCategoryImageRatio);
  const hasValidRatio = width > 0 && height > 0;
  const ratioWidth = hasValidRatio ? width : 1;
  const ratioHeight = hasValidRatio ? height : 1;
  const { classes, cx } = useStyles({
    columns,
    aspectRatio: `${ratioWidth} / ${ratioHeight}`,
  });
  const showInnerShadow = useProductImageShadow();
  const nameMaxLines = useSelector(getProductTileNameMaxLines);

  const image = useMemo(() => ({
    ratio: [ratioWidth, ratioHeight],
    resolutions: [{
      width: IMAGE_WIDTH,
      height: Math.round((IMAGE_WIDTH * ratioHeight) / ratioWidth),
    }],
  }), [ratioHeight, ratioWidth]);

  if (!categories?.length) {
    if (!prerender) {
      return null;
    }

    return (
      <div className={cx(classes.root, 'engage__category__category-grid')} aria-hidden>
        {Array.from({ length: Math.min(prerender, MAX_PLACEHOLDERS) }, (_, index) => (
          <div key={`placeholder-${index}`} className={classes.item}>
            <div className={classes.placeholderImage} />
            <div className={classes.placeholderName} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <ul
      className={cx(classes.root, 'engage__category__category-grid')}
      aria-label={i18n.text('category.sections.categories')}
    >
      {showAllProducts && parentCategory ? (
        <li className={classes.showAllProductsItem}>
          <Portal name={CATEGORY_GRID_SHOW_ALL_PRODUCTS} props={{ categoryId: parentCategory.id }}>
            <CategoryLink
              category={parentCategory}
              allProducts
              className={cx(
                classes.showAllProducts,
                'engage__category__category-grid__show-all-products'
              )}
            >
              {i18n.text('category.showAllProducts.label')}
            </CategoryLink>
          </Portal>
        </li>
      ) : null}
      {categories.map(category => (
        <li key={category.id} className={classes.item}>
          <Portal name={CATEGORY_GRID_ITEM} props={{ categoryId: category.id }}>
            <CategoryLink
              category={category}
              className={cx(classes.tile, 'engage__category__category-grid__item')}
            >
              <div className={cx(classes.imageWrapper, 'engage__category__category-grid__image')}>
                <div
                  className={classes.imageFrame}
                  data-inner-shadow={showInnerShadow ? true : undefined}
                >
                  <CategoryImage
                    className={classes.image}
                    src={category.imageUrl}
                    ratio={image.ratio}
                    resolutions={image.resolutions}
                    fallback={<div className={classes.fallback} />}
                  />
                </div>
              </div>
              <span className={cx(classes.name, 'engage__category__category-grid__name')}>
                <Ellipsis rows={nameMaxLines}>{category.name}</Ellipsis>
              </span>
            </CategoryLink>
          </Portal>
        </li>
      ))}
    </ul>
  );
};

export default CategoryGrid;
