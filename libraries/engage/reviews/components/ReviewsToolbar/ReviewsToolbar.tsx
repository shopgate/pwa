import { useCallback, useMemo, useRef } from 'react';
import type { ComponentType, ElementType } from 'react';
import { ArrowDropIcon, I18n, SelectBox } from '@shopgate/engage/components';
import { ButtonBase } from '@shopgate/engage/components/v2';
import SortItem from '@shopgate/engage/product/components/FilterBar/components/Content/components/Sort/components/Item';
import { makeStyles } from '@shopgate/engage/styles';

type SortSelectProps = {
  items: { label: string; value: string }[];
  initialValue: string;
  handleSelectionUpdate: (value: string) => void;
  icon: ElementType;
  item: ElementType;
  className?: string;
  classNames?: Record<string, string>;
};

const SortSelect = SelectBox as unknown as ComponentType<SortSelectProps>;

const useStyles = makeStyles()(theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
    borderTop: `1px solid ${theme.components.border.light}`,
  },
  selectBox: {
    flexGrow: 2,
    minWidth: 0,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    maxWidth: '100%',
    height: theme.components.filterBar.height,
    color: 'inherit',
    outline: 0,
    whiteSpace: 'nowrap',
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
    },
  },
  selection: {
    alignSelf: 'center',
    minWidth: 0,
    overflow: 'hidden',
    paddingTop: 1,
    textOverflow: 'ellipsis',
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
  },
  icon: {
    fontSize: theme.components.icon.medium,
  },
  iconOpen: {
    transform: 'rotate(180deg)',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    zIndex: 2,
    width: '100%',
    background: theme.palette.background.surface,
    boxShadow: 'rgba(0, 0, 0, 0.16) 0 2px 2px',
  },
  selectItem: {
    width: '100%',
    padding: 0,
    outline: 0,
    overflow: 'hidden',
    color: theme.palette.text.primary,
    textAlign: 'left',
    ':first-child/* emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason */': {
      marginTop: theme.spacing(1),
    },
    ':last-child/* emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason */': {
      marginBottom: theme.spacing(1),
    },
  },
  selectItemSelected: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  filter: {
    flexShrink: 0,
    marginLeft: 'auto',
    minHeight: 44,
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
    },
  },
  pill: {
    padding: '7px 12px',
    border: `1px solid ${theme.components.border.medium}`,
    borderRadius: 999,
    background: theme.palette.background.surface,
    color: theme.palette.text.primary,
    fontSize: 13,
  },
  pressed: {
    borderColor: theme.palette.primary.main,
    background: theme.palette.primary.main,
    color: theme.contrastColor(theme.palette.primary.main),
  },
}));

export interface ReviewsToolbarProps {
  /** The sort of the displayed review list. */
  sort: string;
  /** The sort values the provider supports; the select needs at least two. */
  sortOptions: string[];
  /** Whether the list is restricted to reviews with media. */
  filterMedia: boolean;
  /** Whether the provider supports the media filter. */
  isMediaFilterAvailable: boolean;
  /** Called with the selected sort. */
  onSortChange: (sort: string) => void;
  /** Called with the new state of the media filter. */
  onFilterMediaChange: (filterMedia: boolean) => void;
}

/**
 * Displays the sort select and the media filter of the review list. The sort select is the
 * one of the product filter bar. Renders nothing when the provider supports neither.
 * @returns The rendered component.
 */
const ReviewsToolbar = ({
  sort,
  sortOptions,
  filterMedia,
  isMediaFilterAvailable,
  onSortChange,
  onFilterMediaChange,
}: ReviewsToolbarProps) => {
  const { classes, cx } = useStyles();
  const hasSort = sortOptions.length >= 2;

  const items = useMemo(() => (
    (sortOptions.includes(sort) ? sortOptions : [sort, ...sortOptions]).map(option => ({
      label: `reviews.sort_${option}`,
      value: option,
    }))
  ), [sort, sortOptions]);

  const onSortChangeRef = useRef(onSortChange);
  onSortChangeRef.current = onSortChange;

  const handleSortChange = useCallback((nextSort: string) => {
    onSortChangeRef.current(nextSort);
  }, []);

  if (!hasSort && !isMediaFilterAvailable) {
    return null;
  }

  return (
    <div className={cx(classes.root, 'engage__reviews__reviews-toolbar')}>
      {hasSort && (
        <SortSelect
          items={items}
          initialValue={sort}
          handleSelectionUpdate={handleSortChange}
          icon={ArrowDropIcon}
          item={SortItem}
          className={cx(classes.selectBox, 'engage__reviews__reviews-toolbar__sort')}
          classNames={{
            button: classes.button,
            selection: classes.selection,
            icon: classes.icon,
            iconOpen: classes.iconOpen,
            dropdown: classes.dropdown,
            selectItem: classes.selectItem,
            selectItemSelected: classes.selectItemSelected,
          }}
        />
      )}
      {isMediaFilterAvailable && (
        <ButtonBase
          className={cx(classes.filter, 'engage__reviews__reviews-toolbar__filter-media')}
          aria-pressed={filterMedia}
          onClick={() => onFilterMediaChange(!filterMedia)}
        >
          <span className={cx(classes.pill, { [classes.pressed]: filterMedia })}>
            <I18n.Text string="reviews.filter_media" />
          </span>
        </ButtonBase>
      )}
    </div>
  );
};

export default ReviewsToolbar;
