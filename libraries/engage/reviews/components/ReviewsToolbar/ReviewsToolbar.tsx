import { useCallback, useMemo, useRef } from 'react';
import type { ComponentType, ElementType } from 'react';
import { ArrowDropIcon, I18n, SelectBox } from '@shopgate/engage/components';
import { ButtonBase } from '@shopgate/engage/components/v2';
import SortItem from '@shopgate/engage/product/components/FilterBar/components/Content/components/Sort/components/Item';
import { makeStyles } from '@shopgate/engage/styles';
import type {
  ReviewFilterOption,
  ReviewListFilters,
} from '@shopgate/pwa-common-commerce/reviews/types/reviews';

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
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: theme.spacing(1),
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
    top: theme.components.filterBar.height,
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
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: theme.spacing(1),
    marginLeft: 'auto',
  },
  filter: {
    flexShrink: 0,
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
  /** The active filters of the displayed review list. */
  filters: ReviewListFilters;
  /** The filters the provider supports. */
  filterOptions: ReviewFilterOption[];
  /** Called with the selected sort. */
  onSortChange: (sort: string) => void;
  /** Called with a filter and its new state. */
  onFilterChange: (param: keyof ReviewListFilters, isActive: boolean) => void;
}

/**
 * Displays the sort select and the filters of the review list. The sort select is the
 * one of the product filter bar. Renders nothing when the provider supports neither.
 * @returns The rendered component.
 */
const ReviewsToolbar = ({
  sort,
  sortOptions,
  filters,
  filterOptions,
  onSortChange,
  onFilterChange,
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

  if (!hasSort && filterOptions.length === 0) {
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
      {filterOptions.length > 0 && (
        <div className={cx(classes.filters, 'engage__reviews__reviews-toolbar__filters')}>
          {filterOptions.map(({ param, label }) => (
            <ButtonBase
              key={param}
              className={cx(classes.filter, 'engage__reviews__reviews-toolbar__filter')}
              data-filter={param}
              aria-pressed={!!filters[param]}
              onClick={() => onFilterChange(param, !filters[param])}
            >
              <span className={cx(classes.pill, { [classes.pressed]: !!filters[param] })}>
                <I18n.Text string={label} />
              </span>
            </ButtonBase>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsToolbar;
