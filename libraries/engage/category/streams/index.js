import {
  preferredLocationDidUpdate$,
  preferredLocationDidUpdateGlobal$,
} from '@shopgate/engage/locations';
import {
  categoryDOMCachedEntered$,
  categoryFiltersDidUpdate$,
} from '@shopgate/pwa-common-commerce/category/streams';

export const categoryProductsNeedUpdate$ = preferredLocationDidUpdate$
  .switchMap(() => categoryDOMCachedEntered$.first())
  .merge(categoryFiltersDidUpdate$)
  .merge(preferredLocationDidUpdateGlobal$);
