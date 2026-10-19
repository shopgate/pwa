import { memo } from 'react';
import { useSelector } from 'react-redux';
import { Ellipsis, Portal } from '@shopgate/engage/components';
import { VisuallyHidden } from '@shopgate/engage/a11y';
import { i18n } from '@shopgate/engage/core/helpers';
import CategoryImage from '@shopgate/engage/category/components/CategoryImage';
import type { CategoryImageRatio } from '@shopgate/engage/category/hooks/useCategoryImageRatio';
import { CATEGORY_DRAWER_ITEM } from '@shopgate/engage/category/constants';
import { useProductImageShadow } from '@shopgate/engage/product/hooks';
import { getProductTileNameMaxLines } from '@shopgate/engage/settings/selectors/appSettings';
import { makeStyles } from '@shopgate/engage/styles';
import type { CategoryState, CurrentMark, DrawerCategory } from './types';

const useStyles = makeStyles()(theme => ({
  item: {
    minWidth: 0,
  },
  tile: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    margin: 0,
    padding: theme.components.tiles.padding,
    background: theme.components.tiles.backgroundColor,
    border: theme.components.tiles.border,
    borderRadius: theme.components.tiles.borderRadius,
    color: theme.palette.text.primary,
    font: 'inherit',
    textAlign: 'start',
    outline: 0,
    '&:active': {
      opacity: 0.7,
    },
    '&:focus-visible:not([data-silent-focus])': {
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
  name: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(0.5),
    padding: theme.components.tiles.textPadding,
    paddingTop: theme.components.tiles.textPaddingTop,
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: 1.2,
    wordBreak: 'break-word',
    hyphens: 'auto',
    '[data-current] &': {
      fontWeight: theme.typography.fontWeightBold,
    },
  },
  nameText: {
    flexGrow: 1,
    minWidth: 0,
  },
}));

interface TileProps {
  categoryId: string;
  mark: CurrentMark;
  image: CategoryImageRatio;
  onSelect: (category: DrawerCategory) => void;
}

/**
 * A category of the category drawer as an image tile, for the grid layout.
 * @returns The tile, or nothing while the category is unknown.
 */
const Tile = ({
  categoryId, mark, image, onSelect,
}: TileProps) => {
  const { classes, cx } = useStyles();
  const category = useSelector((state: CategoryState) => state.category.categoriesById[categoryId]);
  const showInnerShadow = useProductImageShadow();
  const nameMaxLines = useSelector(getProductTileNameMaxLines);

  if (!category?.name) {
    return null;
  }

  const hasChildren = Boolean(category.childrenCount);

  return (
    <li className={cx(classes.item, 'theme__category-drawer__tile')}>
      <Portal name={CATEGORY_DRAWER_ITEM} props={{ categoryId }}>
        <button
          type="button"
          className={cx(classes.tile, 'theme__category-drawer__tile__button')}
          onClick={() => onSelect(category)}
          aria-current={mark === 'page' ? 'page' : undefined}
          data-current={mark || undefined}
          data-has-children={hasChildren ? true : undefined}
          data-category-id={categoryId}
          data-test-id={`CategoryDrawerItem-${category.name}`}
        >
          <span className={cx(classes.imageWrapper, 'theme__category-drawer__tile__image')} aria-hidden>
            <span
              className={classes.imageFrame}
              data-inner-shadow={showInnerShadow ? true : undefined}
            >
              <CategoryImage
                className={classes.image}
                src={category.imageUrl}
                ratio={image.ratio}
                resolutions={image.resolutions}
              />
            </span>
          </span>
          <span className={cx(classes.name, 'theme__category-drawer__tile__name')}>
            <span className={classes.nameText}>
              <Ellipsis rows={nameMaxLines}>{category.name}</Ellipsis>
            </span>
            {hasChildren ? (
              <VisuallyHidden>{i18n.text('category.drawer.subcategories')}</VisuallyHidden>
            ) : null}
          </span>
        </button>
      </Portal>
    </li>
  );
};

export default memo(Tile);
