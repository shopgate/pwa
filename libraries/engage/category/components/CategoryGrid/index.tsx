import { makeStyles } from '@shopgate/engage/styles';
import { Portal } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import {
  CATEGORY_GRID_ITEM,
  CATEGORY_GRID_SHOW_ALL_PRODUCTS,
} from '@shopgate/engage/category/constants';
import { useCategoryGridColumns, useCategoryImageRatio } from '@shopgate/engage/category/hooks';
import CategoryLink from '../CategoryLink';
import CategoryTileContent from '../CategoryTileContent';
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
  placeholderImage: {
    aspectRatio,
    borderRadius: theme.components.productImage.borderRadius,
    background: theme.palette.background.emphasized,
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
  /** Whether the grid names itself. Off inside a section that already names it. */
  labelled?: boolean;
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
  labelled = true,
}: CategoryGridProps) => {
  const columns = useCategoryGridColumns();
  const image = useCategoryImageRatio(IMAGE_WIDTH);
  const { classes, cx } = useStyles({
    columns,
    aspectRatio: image.aspectRatio,
  });
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
      aria-label={labelled ? i18n.text('category.sections.categories') : undefined}
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
              <CategoryTileContent
                name={category.name}
                imageUrl={category.imageUrl}
                image={image}
                classNames={{
                  image: 'engage__category__category-grid__image',
                  name: 'engage__category__category-grid__name',
                }}
              />
            </CategoryLink>
          </Portal>
        </li>
      ))}
    </ul>
  );
};

export default CategoryGrid;
