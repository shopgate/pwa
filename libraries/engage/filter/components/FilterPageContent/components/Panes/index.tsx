import { useEffect, useState } from 'react';
import { ButtonBase } from '@shopgate/engage/components/v2';
import { makeStyles } from '@shopgate/engage/styles';
import { FILTER_TYPE_RANGE } from '@shopgate/engage/filter';
import type { APIFilter } from '@shopgate/engage/filter/providers/FilterPageProvider.context';
import Filter from '../Filter';

export interface FilterPanesProps {
  filters: APIFilter[];
  /** Returns the selected value ids, or the selected range for a range filter. */
  getSelectedValues: (id: string) => string[] | null;
  onChange: (id: string, selected: string[]) => void;
}

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '240px minmax(0, 1fr)',
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: '300px minmax(0, 1fr)',
    },
    alignItems: 'start',
    minHeight: '100%',
    color: theme.palette.text.primary,
  },
  nav: {
    position: 'sticky',
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
    padding: theme.spacing(1, 2, 2, 4),
    minWidth: 0,
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    width: '100%',
    minHeight: 48,
    padding: theme.spacing(0, 2),
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.text.primary,
    fontSize: theme.typography.body1.fontSize,
    textAlign: 'left',
    '&[aria-selected="true"]': {
      background: theme.palette.background.emphasized,
      fontWeight: theme.typography.fontWeightMedium,
    },
  },
  count: {
    minWidth: 20,
    height: 20,
    padding: theme.spacing(0, 0.75),
    borderRadius: 10,
    background: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    fontSize: theme.typography.caption.fontSize,
    lineHeight: '20px',
    textAlign: 'center',
  },
  panel: {
    minHeight: '100%',
    padding: theme.spacing(1, 4, 4),
    borderLeft: `1px solid ${theme.components.separatorLine.borderColor}`,
  },
  heading: {
    margin: theme.spacing(1.5, 0, 2),
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

/**
 * Counts the active choices of a filter for its tab.
 * @param filter The filter.
 * @param selected The selected values of the filter.
 * @returns The number of active choices.
 */
const countSelected = (filter: APIFilter, selected: string[] | null) => {
  if (!selected?.length) {
    return 0;
  }

  if (filter.type === FILTER_TYPE_RANGE) {
    const [from, to] = selected.map(Number);
    return from > (filter.minimum ?? from) || to < (filter.maximum ?? to) ? 1 : 0;
  }

  return selected.length;
};

/**
 * The filters as two panes for wide screens: the filters as tabs on the left, the values of the
 * selected one on the right.
 * @returns The rendered component.
 */
const FilterPanes = ({ filters, getSelectedValues, onChange }: FilterPanesProps) => {
  const { classes, cx } = useStyles();
  const [activeId, setActiveId] = useState(filters[0]?.id);
  const active = filters.find(filter => filter.id === activeId) ?? filters[0];

  useEffect(() => {
    if (filters.length && !filters.some(filter => filter.id === activeId)) {
      setActiveId(filters[0].id);
    }
  }, [activeId, filters]);

  if (!active) {
    return null;
  }

  const selected = getSelectedValues(active.id);

  return (
    <div className={cx(classes.root, 'engage__filter-page__panes')}>
      <div className={classes.nav} role="tablist" aria-orientation="vertical">
        {filters.map((filter) => {
          const count = countSelected(filter, getSelectedValues(filter.id));

          return (
            <ButtonBase
              key={filter.id}
              id={`filter-tab-${filter.id}`}
              className={classes.tab}
              role="tab"
              aria-selected={filter.id === active.id}
              aria-controls="filter-panel"
              onClick={() => setActiveId(filter.id)}
            >
              <span>{filter.label}</span>
              {count > 0 && <span className={classes.count}>{count}</span>}
            </ButtonBase>
          );
        })}
      </div>
      <div
        id="filter-panel"
        className={classes.panel}
        role="tabpanel"
        aria-labelledby={`filter-tab-${active.id}`}
      >
        <h2 className={classes.heading}>{active.label}</h2>
        <Filter
          key={active.id}
          filter={active}
          selected={selected}
          onChange={onChange}
          inline
        />
      </div>
    </div>
  );
};

export default FilterPanes;
