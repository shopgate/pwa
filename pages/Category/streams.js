import { routeDidEnter$ } from '@shopgate/pwa-common/streams/router';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';

export const categoryDidEnter$ = routeDidEnter$
  .filter(({ action }) => action.route.pathname === CATEGORY_PATH);
