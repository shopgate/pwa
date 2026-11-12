import type { ComponentType } from 'react';
import { SurroundPortals } from '@shopgate/engage/components';
import { useFilterPage } from '@shopgate/engage/filter/hooks';
import { makeStyles, useMediaQuery } from '@shopgate/engage/styles';
import { PORTAL_FILTER_PAGE_CONTENT } from '@shopgate/engage/filter';
import type { APIFilter } from '@shopgate/engage/filter/providers/FilterPageProvider.context';
import Filter from './components/Filter';
import FilterButtonBar from './components/FilterButtonBar';
import FilterPanes from './components/Panes';

const useStyles = makeStyles()(theme => ({
  content: {
    color: theme.palette.text.primary,
    [theme.breakpoints.up('md')]: {
      width: '100%',
      maxWidth: 640,
      margin: '0 auto',
    },
  },
}));

export interface FilterPageContentProps {
  /**
   * The component to be rendered as the app bar.
   */
  AppBarComponent?: ComponentType<{ title?: string }> | null;
}

/**
 * The FilterPageContent component renders all filters for the filter page.
 * @returns The rendered component.
 */
const FilterPageContent = ({ AppBarComponent = null }: FilterPageContentProps) => {
  const { classes, cx } = useStyles();
  const {
    apiFilters,
    getSelectedFilterValues,
    updateSelectedFilterValues,
  } = useFilterPage();
  const isWide = useMediaQuery(theme => theme.breakpoints.up('md'));

  return (
    <SurroundPortals portalName={PORTAL_FILTER_PAGE_CONTENT}>
      { AppBarComponent && (
        <AppBarComponent title="titles.filter" />
      )}
      {isWide ? (
        <FilterPanes
          filters={apiFilters}
          getSelectedValues={getSelectedFilterValues}
          onChange={updateSelectedFilterValues}
        />
      ) : (
        <div className={cx(classes.content, 'engage__filter-page__content')}>
          {apiFilters.map((filter: APIFilter) => (
            <Filter
              key={filter.id}
              filter={filter}
              selected={getSelectedFilterValues(filter.id)}
              onChange={updateSelectedFilterValues}
            />
          ))}
        </div>
      )}
      <FilterButtonBar />
    </SurroundPortals>
  );
};

export default FilterPageContent;
