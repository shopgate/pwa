import {
  preferredLocationDidUpdate$,
  preferredLocationDidUpdateGlobalNotOnCategory$,
  preferredLocationDidUpdateGlobalOnCategory$,
} from '@shopgate/engage/locations/locations.streams';
import {
  categoryDidBackEnter$,
  categoryFiltersDidUpdate$,
} from '@shopgate/pwa-common-commerce/category/streams';
import {
  productDataExpired$,
} from '@shopgate/pwa-common-commerce/product/streams';

export * from '@shopgate/pwa-common-commerce/category/streams';

export const categoryProductsNeedUpdate$ = preferredLocationDidUpdate$
  .merge(preferredLocationDidUpdateGlobalNotOnCategory$)
  .merge(productDataExpired$)
  .switchMap(() => categoryDidBackEnter$.first())
  .merge(categoryFiltersDidUpdate$)
  .merge(preferredLocationDidUpdateGlobalOnCategory$);

