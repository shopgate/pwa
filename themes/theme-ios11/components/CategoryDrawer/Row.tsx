import { memo } from 'react';
import type { ComponentType } from 'react';
import { useSelector } from 'react-redux';
import { ChevronIcon, SurroundPortals } from '@shopgate/engage/components';
import { CategoryImage as UntypedCategoryImage } from '@shopgate/engage/category/components';
import { CATEGORY_DRAWER_ITEM } from '@shopgate/engage/category/constants';
import { makeStyles } from '@shopgate/engage/styles';
import type { CategoryState, DrawerCategory } from './types';

const CategoryImage = UntypedCategoryImage as unknown as ComponentType<Record<string, unknown>>;

const useStyles = makeStyles()(theme => ({
  item: {
    position: 'relative',
    '&:not(:last-child)::after': {
      content: '""',
      position: 'absolute',
      left: theme.spacing(2),
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${theme.components.separatorLine.borderColor}`,
    },
  },
  button: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    width: '100%',
    minHeight: 52,
    border: 0,
    padding: theme.spacing(1, 1.5, 1, 2),
    background: 'none',
    color: 'inherit',
    font: 'inherit',
    textAlign: 'start',
    '&:active': {
      background: theme.palette.action.pressed,
    },
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: -2,
    },
    '&[aria-current]': {
      fontWeight: theme.typography.fontWeightBold,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: theme.spacing(1.5),
        bottom: theme.spacing(1.5),
        left: 0,
        width: 3,
        borderRadius: '0 3px 3px 0',
        background: theme.palette.primary.main,
      },
    },
    '&[data-emphasized]': {
      fontWeight: theme.typography.fontWeightBold,
    },
  },
  image: {
    flexShrink: 0,
    width: 36,
  },
  label: {
    flexGrow: 1,
    minWidth: 0,
    overflowWrap: 'anywhere',
  },
  chevron: {
    flexShrink: 0,
    fontSize: theme.components.icon.small,
    opacity: 0.5,
    transform: 'rotate(180deg)',
  },
}));

interface RowButtonProps {
  label: string;
  onClick: () => void;
  imageUrl?: string | null;
  showImage?: boolean;
  hasChildren?: boolean;
  isActive?: boolean;
  isEmphasized?: boolean;
  testId?: string;
}

/**
 * An entry of the category drawer.
 * @param props The component props.
 * @param props.label The text of the entry.
 * @param props.onClick Called when the entry is selected.
 * @param props.imageUrl The image of the category.
 * @param props.showImage Whether the entry shows an image.
 * @param props.hasChildren Whether the entry leads to a deeper level.
 * @param props.isActive Whether the visitor currently is in the category of the entry.
 * @param props.isEmphasized Whether the entry stands out from the categories.
 * @param props.testId The test id of the entry.
 * @returns The entry.
 */
export const RowButton = ({
  label,
  onClick,
  imageUrl = null,
  showImage = false,
  hasChildren = false,
  isActive = false,
  isEmphasized = false,
  testId,
}: RowButtonProps) => {
  const { classes, cx } = useStyles();

  return (
    <button
      type="button"
      className={cx(classes.button, 'theme__category-drawer__item-button')}
      onClick={onClick}
      aria-current={isActive ? 'true' : undefined}
      data-emphasized={isEmphasized ? true : undefined}
      data-has-children={hasChildren ? true : undefined}
      data-test-id={testId}
    >
      {showImage ? (
        <span className={cx(classes.image, 'theme__category-drawer__item-image')} aria-hidden>
          <CategoryImage src={imageUrl} />
        </span>
      ) : null}
      <span className={cx(classes.label, 'theme__category-drawer__item-label')}>{label}</span>
      {hasChildren ? <ChevronIcon className={classes.chevron} /> : null}
    </button>
  );
};

interface RowProps {
  categoryId: string;
  isActive: boolean;
  showImage: boolean;
  onSelect: (category: DrawerCategory) => void;
}

/**
 * A category of the category drawer.
 * @param props The component props.
 * @param props.categoryId The id of the category.
 * @param props.isActive Whether the visitor currently is in the category or below it.
 * @param props.showImage Whether the category shows its image.
 * @param props.onSelect Called with the category when it is selected.
 * @returns The category, or nothing while it is unknown.
 */
const Row = ({
  categoryId, isActive, showImage, onSelect,
}: RowProps) => {
  const { classes, cx } = useStyles();
  const category = useSelector((state: CategoryState) => state.category.categoriesById[categoryId]);

  if (!category?.name) {
    return null;
  }

  return (
    <li className={cx(classes.item, 'theme__category-drawer__item')}>
      <SurroundPortals portalName={CATEGORY_DRAWER_ITEM} portalProps={{ categoryId }}>
        <RowButton
          label={category.name}
          onClick={() => onSelect(category)}
          imageUrl={category.imageUrl}
          showImage={showImage}
          hasChildren={Boolean(category.childrenCount)}
          isActive={isActive}
          testId={`CategoryDrawerItem-${category.name}`}
        />
      </SurroundPortals>
    </li>
  );
};

export default memo(Row);
