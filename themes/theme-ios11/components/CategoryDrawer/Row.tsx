import { memo } from 'react';
import { useSelector } from 'react-redux';
import { ChevronIcon, Portal } from '@shopgate/engage/components';
import { VisuallyHidden } from '@shopgate/engage/a11y';
import CategoryImage from '@shopgate/engage/category/components/CategoryImage';
import type { CategoryImageRatio } from '@shopgate/engage/category/hooks/useCategoryImageRatio';
import { CATEGORY_DRAWER_ITEM } from '@shopgate/engage/category/constants';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import type { CategoryState, CurrentMark, DrawerCategory } from './types';

const useStyles = makeStyles()(theme => ({
  item: {
    position: 'relative',
    '&:not(:last-child)::after': {
      content: '""',
      position: 'absolute',
      left: theme.spacing(2),
      right: theme.spacing(2),
      bottom: 0,
      borderBottom: `1px solid ${theme.components.separatorLine.borderColor}`,
    },
  },
  button: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    width: '100%',
    minHeight: 56,
    border: 0,
    padding: theme.spacing(1, 1.5, 1, 2),
    background: 'none',
    color: 'inherit',
    font: 'inherit',
    textAlign: 'start',
    '&:active': {
      background: theme.palette.action.pressed,
    },
    '&:focus-visible:not([data-silent-focus])': {
      outline: `2px solid ${theme.palette.text.primary}`,
      outlineOffset: -2,
    },
    '&[data-current], &[data-emphasized]': {
      fontWeight: theme.typography.fontWeightBold,
    },
  },
  image: {
    flexShrink: 0,
  },
  label: {
    flexGrow: 1,
    minWidth: 0,
    overflowWrap: 'break-word',
    hyphens: 'auto',
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
  categoryId?: string;
  imageUrl?: string | null;
  /** The format of the category image. Without it the entry shows no image. */
  image?: CategoryImageRatio | null;
  hasChildren?: boolean;
  mark?: CurrentMark;
  /** Whether the entry stands out from the categories. */
  isEmphasized?: boolean;
  testId?: string;
}

/**
 * An entry of the category drawer.
 * @returns The entry.
 */
export const RowButton = ({
  label,
  onClick,
  categoryId,
  imageUrl = null,
  image = null,
  hasChildren = false,
  mark = null,
  isEmphasized = false,
  testId,
}: RowButtonProps) => {
  const { classes, cx } = useStyles();

  return (
    <button
      type="button"
      className={cx(classes.button, 'theme__category-drawer__item__button')}
      onClick={onClick}
      aria-current={mark === 'page' ? 'page' : undefined}
      data-current={mark || undefined}
      data-emphasized={isEmphasized ? true : undefined}
      data-has-children={hasChildren ? true : undefined}
      data-category-id={categoryId}
      data-test-id={testId}
    >
      {image ? (
        <span
          className={cx(classes.image, 'theme__category-drawer__item__image')}
          style={{ width: image.thumbnailWidth }}
          aria-hidden
        >
          <CategoryImage
            src={imageUrl}
            ratio={image.ratio}
            resolutions={image.resolutions}
          />
        </span>
      ) : null}
      <span className={cx(classes.label, 'theme__category-drawer__item__label')}>{label}</span>
      {hasChildren ? (
        <>
          <VisuallyHidden>{i18n.text('category.drawer.subcategories')}</VisuallyHidden>
          <span aria-hidden>
            <ChevronIcon className={cx(classes.chevron, 'theme__category-drawer__item__chevron')} />
          </span>
        </>
      ) : null}
    </button>
  );
};

interface RowProps {
  categoryId: string;
  mark: CurrentMark;
  image: CategoryImageRatio | null;
  onSelect: (category: DrawerCategory) => void;
}

/**
 * A category of the category drawer.
 * @returns The category, or nothing while it is unknown.
 */
const Row = ({
  categoryId, mark, image, onSelect,
}: RowProps) => {
  const { classes, cx } = useStyles();
  const category = useSelector((state: CategoryState) => state.category.categoriesById[categoryId]);

  if (!category?.name) {
    return null;
  }

  return (
    <li className={cx(classes.item, 'theme__category-drawer__item')}>
      <Portal name={CATEGORY_DRAWER_ITEM} props={{ categoryId }}>
        <RowButton
          label={category.name}
          onClick={() => onSelect(category)}
          categoryId={categoryId}
          imageUrl={category.imageUrl}
          image={image}
          hasChildren={Boolean(category.childrenCount)}
          mark={mark}
          testId={`CategoryDrawerItem-${category.name}`}
        />
      </Portal>
    </li>
  );
};

export default memo(Row);
