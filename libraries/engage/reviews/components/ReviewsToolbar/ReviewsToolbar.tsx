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

const RATE_ITEMS = ['0', '5', '4', '3', '2', '1'].map(value => ({
  label: value === '0' ? 'reviews.filter_rate_all' : `reviews.filter_rate_${value}`,
  value,
}));

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
  selects: {
    display: 'flex',
    flexGrow: 2,
    minWidth: 0,
  },
  selectBox: {
    minWidth: 0,
  },
  rateSelectBox: {
    flexShrink: 0,
    marginLeft: theme.spacing(2),
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    maxWidth: '100%',
    height: theme.components.filterBar.height,
    padding: 0,
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
  /** Called with a filter and its new value; a falsy value removes the filter. */
  onFilterChange: (param: keyof ReviewListFilters, value?: boolean | number) => void;
}

/**
 * Displays the sort select and the filters of the review list. The selects are those of
 * the product filter bar. Renders nothing when the provider supports neither.
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

  const handlers = useRef({
    onSortChange,
    onFilterChange,
  });
  handlers.current = {
    onSortChange,
    onFilterChange,
  };

  const handleSortChange = useCallback((nextSort: string) => {
    handlers.current.onSortChange(nextSort);
  }, []);

  const handleRateChange = useCallback((value: string) => {
    handlers.current.onFilterChange('filterRate', Number(value) || undefined);
  }, []);

  const hasRateFilter = filterOptions.some(option => option.type === 'rate');
  const toggles = filterOptions.filter(option => option.type === 'toggle');

  if (!hasSort && filterOptions.length === 0) {
    return null;
  }

  const selectClassNames = {
    button: classes.button,
    selection: classes.selection,
    icon: classes.icon,
    iconOpen: classes.iconOpen,
    dropdown: classes.dropdown,
    selectItem: classes.selectItem,
    selectItemSelected: classes.selectItemSelected,
  };

  return (
    <div className={cx(classes.root, 'engage__reviews__reviews-toolbar')}>
      {(hasSort || hasRateFilter) && (
        <div className={cx(classes.selects, 'engage__reviews__reviews-toolbar__selects')}>
          {hasSort && (
            <SortSelect
              items={items}
              initialValue={sort}
              handleSelectionUpdate={handleSortChange}
              icon={ArrowDropIcon}
              item={SortItem}
              className={cx(classes.selectBox, 'engage__reviews__reviews-toolbar__sort')}
              classNames={selectClassNames}
            />
          )}
          {hasRateFilter && (
            <SortSelect
              items={RATE_ITEMS}
              initialValue={String(filters.filterRate ?? 0)}
              handleSelectionUpdate={handleRateChange}
              icon={ArrowDropIcon}
              item={SortItem}
              className={cx(classes.selectBox, {
                [classes.rateSelectBox]: hasSort,
              }, 'engage__reviews__reviews-toolbar__filter-rate')}
              classNames={selectClassNames}
            />
          )}
        </div>
      )}
      {toggles.length > 0 && (
        <div className={cx(classes.filters, 'engage__reviews__reviews-toolbar__filters')}>
          {toggles.map(({ param, label }) => (
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
