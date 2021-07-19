import {
  preferredLocationDidUpdate$,
  preferredLocationDidUpdateGlobalNotOnCategory$,
  preferredLocationDidUpdateGlobalOnCategory$,
} from '@shopgate/engage/locations';
import {
  categoryDidBackEnter$,
  categoryFiltersDidUpdate$,
} from '@shopgate/pwa-common-commerce/category/streams';

export const categoryProductsNeedUpdate$ = preferredLocationDidUpdate$
  .merge(preferredLocationDidUpdateGlobalNotOnCategory$)
  .switchMap(() => categoryDidBackEnter$.first())
  .merge(categoryFiltersDidUpdate$)
  .merge(preferredLocationDidUpdateGlobalOnCategory$);

