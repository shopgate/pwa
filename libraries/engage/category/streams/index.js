import {
  preferredLocationDidUpdate$,
  preferredLocationDidUpdateGlobalNotOnCategory$,
  preferredLocationDidUpdateGlobalOnCategory$,
} from '@shopgate/engage/locations';
import {
  categoryDOMCachedEntered$,
  categoryFiltersDidUpdate$,
} from '@shopgate/pwa-common-commerce/category/streams';

export const categoryProductsNeedUpdate$ = preferredLocationDidUpdate$
  .merge(preferredLocationDidUpdateGlobalNotOnCategory$)
  .switchMap(() => categoryDOMCachedEntered$.first())
  .merge(categoryFiltersDidUpdate$)
  .merge(preferredLocationDidUpdateGlobalOnCategory$);

