import { router } from '@shopgate/pwa-common/helpers/router';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import {
  buildFilterParamsForFetchFiltersRequest,
} from '@shopgate/engage/filter/helpers';
import {
  CATEGORY_ALL_FILTER_PATTERN,
} from '../../category/constants';
import { SEARCH_FILTER_PATTERN } from '../../search/constants';
import fetchCategory from '../../category/actions/fetchCategory';
import {
  getShowAllProductsFilters,
} from '../../category/helpers';
import fetchFilters from '../actions/fetchFilters';
import { filterDidEnter$ } from '../streams';

/**
 * Filters subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function filters(subscribe) {
  subscribe(filterDidEnter$, async ({ dispatch, action }) => {
    if (action?.route?.pattern === SEARCH_FILTER_PATTERN && !action.route.query?.s) {
      // Filters can't be requested without a search phrase.
      return;
    }

    let { filters: routeFilters } = action?.route?.state || {};

    if (action?.route?.pattern === CATEGORY_ALL_FILTER_PATTERN) {
      if (!routeFilters) {
        const category = await dispatch(fetchCategory(hex2bin(action.route.params.categoryId)));

        routeFilters = getShowAllProductsFilters(category);

        router.update(
          action.route.id,
          {
            filters: routeFilters,
            categoryName: category.name,
          }
        );
      }
    }

    dispatch(fetchFilters({
      filters: buildFilterParamsForFetchFiltersRequest(routeFilters),
    }));
  });
}
