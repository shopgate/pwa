import type { ComponentType, ReactNode } from 'react';
import { FilterPageProvider } from '../../providers';
import Content, { type FilterPageContentProps } from '../FilterPageContent';
import type { RouteFilters } from '../../providers/FilterPageProvider.context';

export interface FilterPageContentWithProviderProps {
  /**
   * Active filters of the filtered product list.
   */
  activeFilters?: RouteFilters | null;
  /**
   * Id of the route with the product list that's supposed to be filtered.
   */
  parentRouteId?: string | null;
  /**
   * Category used to select the available filters from Redux.
   */
  categoryId?: string | null;
  /**
   * Search phrase used to select the available filters from Redux.
   */
  searchPhrase?: string | null;
  /**
   * Filters used for product requests. May contain filters that aren't part of "activeFilters",
   * since they are not supposed to be visible to the user.
   */
  filters?: RouteFilters | null;
  /**
   * Component rendered as the app bar.
   */
  AppBarComponent?: FilterPageContentProps['AppBarComponent'];
}

/**
 * Props of the connected FilterPageProvider. categoryId, searchPhrase and filters are read by its
 * mapStateToProps to select the available filters.
 */
type ConnectedFilterPageProviderProps = Omit<
  FilterPageContentWithProviderProps,
  'AppBarComponent'
> & {
  children: ReactNode;
};

const Provider = FilterPageProvider as unknown as ComponentType<ConnectedFilterPageProviderProps>;

/**
 * The filter page content wrapped with the FilterPageProvider.
 */
const FilterPageContentWithProvider = ({
  categoryId = null,
  searchPhrase = null,
  activeFilters = null,
  filters = null,
  parentRouteId = null,
  AppBarComponent = null,
}: FilterPageContentWithProviderProps) => (
  <Provider
    activeFilters={activeFilters}
    categoryId={categoryId}
    searchPhrase={searchPhrase}
    filters={filters}
    parentRouteId={parentRouteId}
  >
    <Content AppBarComponent={AppBarComponent} />
  </Provider>
);

export default FilterPageContentWithProvider;
