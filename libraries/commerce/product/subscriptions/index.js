import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { getSettings, historyPop, historyPush, routeWillEnter$, routeWillLeave$ } from '@shopgate/engage/core';
import ToastProvider from '@shopgate/pwa-common/providers/toast';
import { getSearchRoute } from '@shopgate/pwa-common-commerce/search';
import fetchProduct from '../actions/fetchProduct';
import fetchProductDescription from '../actions/fetchProductDescription';
import fetchProductProperties from '../actions/fetchProductProperties';
import fetchProductImages from '../actions/fetchProductImages';
import fetchProductShipping from '../actions/fetchProductShipping';
import fetchProductVariants from '../actions/fetchProductVariants';
import fetchProductOptions from '../actions/fetchProductOptions';
import fetchProductMedia from '../actions/fetchProductMedia';
import { productImageFormats } from '../collections';
import {
  productWillEnter$,
  galleryWillEnter$,
  productReceived$,
  cachedProductReceived$,
  productRelationsReceived$,
  receivedVisibleProduct$,
  errorProductResourcesNotFound$,
  visibleProductNotFound$,
  productNotAvailable$,
} from '../streams';
import fetchProductsById from '../actions/fetchProductsById';
import { getProductRelationsByHash } from '../selectors/relations';
import { checkoutSucceeded$ } from '../../checkout/streams';
import expireProductById from '../action-creators/expireProductById';
import { ITEM_PATTERN, NOT_AVAILABLE_EFFECTIVITY_DATES } from '../constants';
import { getProductName } from '../selectors/product';

/**
 * Product subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
function product(subscribe) {
  const processProduct$ = productReceived$.merge(cachedProductReceived$);

  subscribe(productWillEnter$, ({ action, dispatch }) => {
    const { productId } = action.route.params;
    const { productId: variantId } = action.route.state;
    const id = variantId || hex2bin(productId);

    dispatch(fetchProduct(id));
    dispatch(fetchProductDescription(id));
    dispatch(fetchProductProperties(id));
    dispatch(fetchProductImages(id, productImageFormats.getAllUniqueFormats()));
    dispatch(fetchProductShipping(id));
    dispatch(fetchProductMedia(id));
  });

  subscribe(galleryWillEnter$, ({ action, dispatch }) => {
    const { productId } = action.route.params;
    dispatch(fetchProductImages(hex2bin(productId), productImageFormats.getAllUniqueFormats()));
  });

  subscribe(processProduct$, ({ action, dispatch }) => {
    const {
      id,
      flags = {
        hasVariants: false,
        hasOptions: false,
      },
      baseProductId,
    } = action.productData;

    if (baseProductId) {
      dispatch(fetchProduct(baseProductId));
      dispatch(fetchProductImages(baseProductId, productImageFormats.getAllUniqueFormats()));
    }

    if (flags.hasVariants) {
      dispatch(fetchProductVariants(id));
    }

    if (flags.hasOptions) {
      dispatch(fetchProductOptions(id));
    }
  });

  const errorProductResourcesNotFoundFirst$ = receivedVisibleProduct$
    .switchMap(() => errorProductResourcesNotFound$.first());

  /** Refresh product data after some of resources has ENOTFOUND code */
  subscribe(errorProductResourcesNotFoundFirst$, ({ action, dispatch }) => {
    const { productId } = action;
    dispatch(fetchProduct(productId, true));
  });

  const productNotFound$ = visibleProductNotFound$.withLatestFrom((
    receivedVisibleProduct$.startWith({ action: { productData: {} } })
  ));
  /** Visible product is no more available */
  subscribe(productNotFound$, ([{ action, dispatch }, { action: { productData } }]) => {
    const { productId } = action;
    const name = productData.id === productId ? productData.name : productId;

    dispatch(showModal({
      confirm: null,
      dismiss: 'modal.ok',
      title: 'modal.title_error',
      message: 'product.no_more_found',
      params: {
        name,
      },
    }));
    dispatch(historyPop());
    dispatch(expireProductById(productId));
  });

  subscribe(productRelationsReceived$, ({ dispatch, getState, action }) => {
    const { hash } = action;
    const productIds = getProductRelationsByHash(hash)(getState());

    dispatch(fetchProductsById(productIds));
  });

  /**
   * Expire products after checkout, fetch updated data
   */
  subscribe(checkoutSucceeded$, ({ dispatch, action }) => {
    const { products } = action;

    const productIds = products.map(p => p.product.id);
    productIds.forEach(id => dispatch(expireProductById(id)));

    dispatch(fetchProductsById(productIds));
  });

  const productNotAvailableEffDates$ = productNotAvailable$
    .filter(({ action }) => action.reason === NOT_AVAILABLE_EFFECTIVITY_DATES);

  /** PDP expired effectivity dates */
  const productNotAvailableEffDatesPDP$ = productNotAvailableEffDates$
    .withLatestFrom(routeWillEnter$)
    .filter(([notAvailable, willEnter]) => (
      willEnter.action.route.pattern === ITEM_PATTERN
      && notAvailable.action.productId === willEnter.action.route.state.productId
    )).map(([notAvailable]) => notAvailable);

  subscribe(productNotAvailableEffDatesPDP$, ({
    action, getState, dispatch, events,
  }) => {
    const { accessExpired } = getSettings('@shopgate/engage/product/EffectivityDates') || {};
    if (accessExpired === false) {
      const { productId } = action;
      dispatch(historyPop());
      const name = getProductName(getState(), { productId });
      events.emit(ToastProvider.ADD, {
        id: 'product.available.not_search_similar',
        message: 'product.available.not_search_similar',
        messageParams: {
          name,
        },
        action: () => dispatch(historyPush({
          pathname: getSearchRoute(name),
        })),
      });
    }
  });

  /** Expired effectivity dates products after PLP leave */
  const productNotAvailableEffDatesPLP$ = productNotAvailableEffDates$
    .buffer(routeWillLeave$)
    .filter(buffered => buffered.length);

  subscribe(productNotAvailableEffDatesPLP$, (buffered) => {
    const [{ dispatch }] = buffered;
    const productIds = buffered.map(params => params.action.productId);
    dispatch(expireProductById(productIds, true));
  });
}

export default product;
