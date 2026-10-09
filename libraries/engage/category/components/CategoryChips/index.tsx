import { useSelector } from 'react-redux';
import { makeStyles } from '@shopgate/engage/styles';
import { Portal, SurroundPortals } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import {
  CATEGORY_CHIPS,
  CATEGORY_CHIPS_ITEM,
  CATEGORY_CHIPS_SHOW_ALL_PRODUCTS,
} from '@shopgate/engage/category/constants';
import { getCategoryImagePlaceholder } from '@shopgate/engage/settings/selectors/shopSettings';
import CategoryImage from '../CategoryImage';
import CategoryLink from '../CategoryLink';
import type { CategoryNavigationItem } from '../../types';

const IMAGE_RATIO = [1, 1];
const IMAGE_RESOLUTIONS = [{
  width: 96,
  height: 96,
}];
const CHIP_PADDING = 4;
const CHIP_TEXT_PADDING = 12;
const CHIP_HEIGHT = 40;
const CHIP_BORDER = 1;
const MAX_PLACEHOLDERS = 5;

const useStyles = makeStyles({ name: 'CategoryChips' })(theme => ({
  root: {
    display: 'flex',
    gap: theme.spacing(1),
    margin: 0,
    padding: theme.spacing(1, 2),
    listStyle: 'none',
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '& > *': {
      flexShrink: 0,
    },
  },
  item: {
    '&[data-has-image] > *': {
      padding: `${CHIP_PADDING}px ${CHIP_TEXT_PADDING}px ${CHIP_PADDING}px ${CHIP_PADDING}px`,
    },
    '&[data-show-all-products] > *': {
      fontWeight: theme.typography.fontWeightBold,
    },
  },
  chip: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    maxWidth: 'min(75vw, 280px)',
    minHeight: CHIP_HEIGHT,
    padding: `0 ${CHIP_TEXT_PADDING}px`,
    border: `${CHIP_BORDER}px solid ${theme.components.input.border}`,
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.background.surface,
    color: theme.palette.text.primary,
    fontSize: theme.typography.body2.fontSize,
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    outline: 0,
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.text.primary}`,
      outlineOffset: 2,
    },
  },
  label: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  image: {
    width: CHIP_HEIGHT - (2 * CHIP_PADDING) - (2 * CHIP_BORDER),
    flexShrink: 0,
    borderRadius: `max(0px, calc(${theme.shape.borderRadius} - ${CHIP_PADDING}px))`,
  },
  fallback: {
    width: '100%',
    height: '100%',
    background: theme.palette.background.emphasized,
  },
  placeholder: {
    width: 96,
    height: 40,
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.background.emphasized,
  },
}));

export interface CategoryChipsProps {
  categories?: CategoryNavigationItem[] | null;
  /** Number of placeholder chips while the categories load. */
  prerender?: number;
  showImages?: boolean;
  /** The category whose subcategories are shown. */
  parentCategory?: CategoryNavigationItem | null;
  /** Whether the first chip shows all products of the parent category. */
  showAllProducts?: boolean;
}

/**
 * Renders categories as a swipeable row of chips.
 * @returns The chips.
 */
const CategoryChips = ({
  categories,
  prerender = 0,
  showImages = false,
  parentCategory = null,
  showAllProducts = false,
}: CategoryChipsProps) => {
  const { classes, cx } = useStyles();
  const placeholderSrc = useSelector(getCategoryImagePlaceholder) as string | null;

  if (!categories?.length) {
    if (!prerender) {
      return null;
    }

    return (
      <div className={cx(classes.root, 'engage__category__category-chips')} aria-hidden>
        {Array.from({ length: Math.min(prerender, MAX_PLACEHOLDERS) }, (_, index) => (
          <div key={`placeholder-${index}`} className={classes.placeholder} />
        ))}
      </div>
    );
  }

  return (
    <SurroundPortals
      portalName={CATEGORY_CHIPS}
      portalProps={{ categoryId: parentCategory?.id ?? null }}
    >
      <ul
        className={cx(classes.root, 'engage__category__category-chips')}
        aria-label={i18n.text('category.sections.categories')}
      >
        {showAllProducts && parentCategory ? (
          <li className={classes.item} data-show-all-products>
            <Portal
              name={CATEGORY_CHIPS_SHOW_ALL_PRODUCTS}
              props={{ categoryId: parentCategory.id }}
            >
              <CategoryLink
                category={parentCategory}
                allProducts
                className={cx(
                  classes.chip,
                  'engage__category__category-chips__show-all-products'
                )}
              >
                <span className={classes.label}>
                  {i18n.text('category.showAllProducts.label')}
                </span>
              </CategoryLink>
            </Portal>
          </li>
        ) : null}
        {categories.map((category) => {
          const hasImage = showImages && Boolean(category.imageUrl || placeholderSrc);

          return (
            <li
              key={category.id}
              className={classes.item}
              data-has-image={hasImage ? true : undefined}
            >
              <Portal name={CATEGORY_CHIPS_ITEM} props={{ categoryId: category.id }}>
                <CategoryLink
                  category={category}
                  className={cx(classes.chip, 'engage__category__category-chips__item')}
                >
                  {hasImage && (
                    <CategoryImage
                      className={classes.image}
                      src={category.imageUrl}
                      ratio={IMAGE_RATIO}
                      resolutions={IMAGE_RESOLUTIONS}
                      fallback={<div className={classes.fallback} />}
                    />
                  )}
                  <span className={classes.label}>{category.name}</span>
                </CategoryLink>
              </Portal>
            </li>
          );
        })}
      </ul>
    </SurroundPortals>
  );
};

export default CategoryChips;
