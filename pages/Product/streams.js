import { routeDidEnter } from '@shopgate/pwa-common/streams/history';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';

export const writeReviewRouteDidEnter$ = routeDidEnter(ITEM_PATH)
  .filter(({ pathname }) => (
    pathname.endsWith('write_review') || pathname.endsWith('write_review/')
  ));

export const reviewsRouteDidEnter$ = routeDidEnter(ITEM_PATH)
  .filter(({ pathname }) => (
    pathname.endsWith('reviews') || pathname.endsWith('reviews/')
  ));
