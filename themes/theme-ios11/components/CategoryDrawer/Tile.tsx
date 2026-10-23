import { memo } from 'react';
import { useSelector } from 'react-redux';
import { Portal } from '@shopgate/engage/components';
import { VisuallyHidden } from '@shopgate/engage/a11y';
import { i18n } from '@shopgate/engage/core/helpers';
import CategoryTileContent from '@shopgate/engage/category/components/CategoryTileContent';
import type { CategoryImageRatio } from '@shopgate/engage/category/hooks/useCategoryImageRatio';
import { CATEGORY_DRAWER_ITEM } from '@shopgate/engage/category/constants';
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
  name: {
    '[data-current] &': {
      fontWeight: theme.typography.fontWeightBold,
    },
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
          <CategoryTileContent
            name={category.name}
            imageUrl={category.imageUrl}
            image={image}
            classNames={{
              image: 'theme__category-drawer__tile__image',
              name: cx(classes.name, 'theme__category-drawer__tile__name'),
            }}
          >
            {hasChildren ? (
              <VisuallyHidden>{i18n.text('category.drawer.subcategories')}</VisuallyHidden>
            ) : null}
          </CategoryTileContent>
        </button>
      </Portal>
    </li>
  );
};

export default memo(Tile);
