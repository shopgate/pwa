import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { main$ } from '@shopgate/pwa-common/streams/main';
import {
  RECEIVE_PRODUCTS,
  RECEIVE_PRODUCT,
  SET_PRODUCT_ID,
  ITEM_PATH,
} from '@shopgate/pwa-common-commerce/product/constants';
import {
  getCurrentProduct,
  getCurrentBaseProductId,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import { isProductChildrenSelected } from '@shopgate/pwa-common-commerce/product/selectors/variants';
import { pwaDidAppear$ } from './app';

/**
 * Emits when product results has been received.
 */
export const productsReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_PRODUCTS);

/**
 * Emits when product result has been received.
 */
export const productReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_PRODUCT);

/**
 * Emits when the current product id changed.
 */
const currentProductIdChanged$ = main$
  .filter(({ action, prevState }) => {
    // Disabled for now since product data needs to be selected different within PWA 6.0
    return false;
    // eslint-disable-next-line no-unreachable
    const prevId = getCurrentBaseProductId(prevState);
    return (
      action.type === SET_PRODUCT_ID &&
      !!action.productId &&
      action.productId !== prevId
    );
  });

  /**
 * Emits when the category route comes active again after a legacy page was active.
 */
const productRouteReappeared$ = pwaDidAppear$
  .filter(({ action }) => action.route.pattern.startsWith(ITEM_PATH));

/**
 * Emits when a product page is ready to be tracked, considering loaded or preloaded data.
 */
export const productIsReady$ = currentProductIdChanged$
  .switchMap((data) => {
    const product = getCurrentProduct(data.getState()) !== null;

    // Return the productReceived$ stream if the product data is not there yet
    if (!product) {
      return productReceived$;
    }

    // Return a new stream that just emits with the current data.
    return Observable.of(data);
  })
  .filter(({ getState }) => !isProductChildrenSelected(getState()))
  .merge(productRouteReappeared$);
