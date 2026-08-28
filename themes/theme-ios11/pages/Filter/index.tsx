import { CATEGORY_ALL_FILTER_PATTERN } from '@shopgate/engage/category/constants';
import { buildFilterParamsForFetchFiltersRequest } from '@shopgate/engage/filter/helpers';
import { useRoute } from '@shopgate/engage/core/hooks';
import { View } from '@shopgate/engage/components';
import Content from '@shopgate/engage/filter/components/FilterPageContentWithProvider';
import type { RouteFilters } from '@shopgate/engage/filter/providers/FilterPageProvider.context';
import { CloseBar } from 'Components/AppBar/presets';

/**
 * The subset of the current route that the filter page reads.
 */
interface FilterRoute {
  /** Route params — carries the category id on category filter routes. */
  params: { categoryId?: string };
  /** Query params — carries the search phrase on search filter routes. */
  query: { s?: string };
  /** Route state — the active filters and the id of the route to apply them to. */
  state: { filters?: RouteFilters; parentId?: string };
  pattern: string;
  visible: boolean;
}

const ViewComponent = View as React.ComponentType<{
  'aria-hidden'?: boolean;
  children?: React.ReactNode;
}>;

const CloseBarComponent = CloseBar as unknown as React.ComponentType;

/**
 * The Filter page.
 * @returns The rendered filter page.
 */
const Filter = () => {
  const {
    params: { categoryId } = {},
    query: { s: searchPhrase } = {},
    state,
    pattern,
    visible,
  } = useRoute() as FilterRoute;
  const { filters, parentId } = state ?? {};

  const sourceProps = pattern === CATEGORY_ALL_FILTER_PATTERN
    ? {
      searchPhrase: '*',
      filters: buildFilterParamsForFetchFiltersRequest(filters) as RouteFilters,
    }
    : {
      ...(categoryId ? { categoryId } : {}),
      ...(searchPhrase ? { searchPhrase } : {}),
    };

  return (
    <ViewComponent aria-hidden={false}>
      {visible ? (
        <Content
          AppBarComponent={CloseBarComponent}
          activeFilters={filters}
          parentRouteId={parentId}
          {...sourceProps}
        />
      ) : null}
    </ViewComponent>
  );
};

export default Filter;
