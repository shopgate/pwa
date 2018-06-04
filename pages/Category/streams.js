import { routeWillEnter$ } from '@shopgate/pwa-common/streams/router';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';

export const categoryWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pathname.startsWith(`${CATEGORY_PATH}/`));
